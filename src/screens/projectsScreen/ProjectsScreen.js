import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import ProjectsComponent from '../../components/module/ProjectsComponent';

const ProjectsScreen = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <ProjectsComponent />
    </ContainerComponent>
  );
};

export default ProjectsScreen;
