// src/hooks/useFile.js
import { useState, useCallback } from 'react';
import FileService from '../services/FileService';

export const useFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);

  const fileService = new FileService();

  const handleError = (error) => {
    setError(error.message || 'An error occurred');
    setLoading(false);
  };

  const pickDocument = useCallback(async (fileTypes) => {
    try {
      setLoading(true);
      setError(null);
      const file = await fileService.pickDocument(fileTypes);
      if (file) {
        setCurrentFile(file);
      }
      return file;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadFile = useCallback(async (url, filename) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const filePath = await fileService.downloadFile(url, filename, (progress) => {
        setProgress(progress);
      });

      setCurrentFile({
        name: filename,
        uri: filePath,
      });

      return filePath;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const openFile = useCallback(async (filePath) => {
    try {
      setLoading(true);
      setError(null);
      await fileService.openFile(filePath);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFile = useCallback(async (content, filename) => {
    try {
      setLoading(true);
      setError(null);
      const filePath = await fileService.saveFile(content, filename);
      setCurrentFile({
        name: filename,
        uri: filePath,
      });
      return filePath;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (filePath) => {
    try {
      setLoading(true);
      setError(null);
      await fileService.deleteFile(filePath);
      setCurrentFile(null);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    progress,
    currentFile,
    pickDocument,
    downloadFile,
    openFile,
    saveFile,
    deleteFile,
    clearError: () => setError(null),
  };
};