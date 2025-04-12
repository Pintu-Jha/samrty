export const gradientColorTokensMap = {
  // Light Mode Gradients
  HomeGR: [
    'hsla(55, 96%, 69%, 1)', // Yellowish
    'hsla(41, 97%, 64%, 1)', // Light Orange
    'hsla(43, 100%, 50%, 1)', // Darker Orange
  ],
  White: ['#FFFFFF', '#FFFFFF'], // Pure White Gradient

  // Dark Mode Gradients
  Black: ['#000000', '#121212'], // Black to Dark Grey
  DarkGR: ['#1A1A1A', '#1A1A1A', '#1A1A1A'], // Dark Grey to Black
  DarkBlue: ['#2C3E50', '#34495E'], // Gradient of Dark Blues
};

const Colors = {
  default: {
    primaryColor: '#008000', // Green

    background: 'rgba(236, 229, 221, 1)', // Light Beige
    backgroundTransparent: 'rgba(236, 229, 221, 0.5)', // Light Beige (50% opacity)

    primaryText: 'rgba(7, 94, 84, 1)', // WhatsApp Green
    primaryTextTransparent: 'rgba(7, 94, 84, 0.5)', // WhatsApp Green (50% opacity)

    secondaryText: 'rgba(18, 140, 126, 1)', // Darker WhatsApp Green
    secondaryTextTransparent: 'rgba(18, 140, 126, 0.5)', // Darker WhatsApp Green (50% opacity)

    accent: 'rgba(37, 211, 102, 1)', // Bright Green
    accentTransparent: 'rgba(37, 211, 102, 0.5)', // Bright Green (50% opacity)

    grey: 'rgba(169, 169, 169, 1)', // Muted Gray
    greyTransparent: 'rgba(169, 169, 169, 0.5)', // Muted Gray (50% opacity)

    divider: 'rgba(217, 217, 217, 1)', // Light Gray
    dividerTransparent: 'rgba(217, 217, 217, 0.5)', // Light Gray (50% opacity)

    error: 'rgba(217, 83, 79, 1)', // Soft Red
    errorTransparent: 'rgba(217, 83, 79, 0.5)', // Soft Red (50% opacity)

    white: 'rgba(255, 255, 255, 1)', // Pure White
    black: 'rgba(33, 33, 33, 1)', // Dark Charcoal

    blue: 'rgb(76, 59, 207)',
    blueLight:'#d7d7f8',

    redLight:'#feded9',

    // Light mode message colors
    messageIncoming: '#FFFFFF',          // White for incoming
    messageOutgoing: '#E7FFDB',         // WhatsApp light green for outgoing
    messageIncomingDark: '#202C33',     // WhatsApp dark mode incoming
    messageOutgoingDark: '#005C4B',     // WhatsApp dark mode outgoing
    messageSelected: 'rgba(0, 150, 136, 0.2)', // Selection color
    
    // Message text colors
    messageTextIncoming: '#111B21',      // WhatsApp dark gray
    messageTextOutgoing: '#111B21',      // Same dark gray for outgoing
    messageTextDark: '#E9EDEF',         // WhatsApp dark mode text
    
    // Timestamp colors
    messageTimestamp: '#667781',        // WhatsApp timestamp gray
    messageTimestampDark: '#8696A0',  
    
  },

  light: {
    white: 'rgba(255, 255, 255, 1)', // Pure White
    whiteTransparent: 'rgba(255, 255, 255, 0.5)', // Pure White (50% opacity)

    black: 'rgba(33, 33, 33, 1)', // Dark Charcoal
    blackTransparent: 'rgba(33, 33, 33, 0.5)', // Dark Charcoal (50% opacity)

    grey: '#f5f5f5', // Medium Gray
    greyTransparent: 'rgba(77, 77, 77, 0.5)', // Medium Gray (50% opacity)

    accent: 'rgba(18, 140, 126, 1)', // WhatsApp Green
    accentTransparent: 'rgba(18, 140, 126, 0.5)', // WhatsApp Green (50% opacity)

    divider: 'rgba(224, 224, 224, 1)', // Light Gray
    dividerTransparent: 'rgba(224, 224, 224, 0.5)', // Light Gray (50% opacity)

    error: 'rgba(229, 57, 53, 1)', // Bright Red
    errorTransparent: 'rgba(229, 57, 53, 0.5)', // Bright Red (50% opacity)

     // Light mode message colors
     messageIncoming: '#FFFFFF',          // White for incoming
     messageOutgoing: '#E7FFDB',         // WhatsApp light green for outgoing
     messageIncomingDark: '#202C33',     // WhatsApp dark mode incoming
     messageOutgoingDark: '#005C4B',     // WhatsApp dark mode outgoing
     messageSelected: 'rgba(0, 150, 136, 0.2)', // Selection color
     
     // Message text colors
     messageTextIncoming: '#111B21',      // WhatsApp dark gray
     messageTextOutgoing: '#111B21',      // Same dark gray for outgoing
     messageTextDark: '#E9EDEF',         // WhatsApp dark mode text
     
     // Timestamp colors
     messageTimestamp: '#667781',        // WhatsApp timestamp gray
     messageTimestampDark: '#8696A0',  
  },

  dark: {
    black: 'rgba(18, 18, 18, 1)', // Dark Gray
    blackTransparent: 'rgba(18, 18, 18, 0.5)', // Dark Gray (50% opacity)

    grey: 'rgba(58, 58, 58, 1)', // Dim Gray
    greyTransparent: 'rgba(58, 58, 58, 0.5)', // Dim Gray (50% opacity)

    lightGrey: 'rgba(179, 179, 179, 1)', // Muted Gray
    lightGreyTransparent: 'rgba(179, 179, 179, 0.5)', // Muted Gray (50% opacity)

    accent: 'rgba(37, 211, 102, 1)', // Bright Green
    accentTransparent: 'rgba(37, 211, 102, 0.5)', // Bright Green (50% opacity)

    divider: 'rgba(31, 31, 31, 1)', // Almost Black
    dividerTransparent: 'rgba(31, 31, 31, 0.5)', // Almost Black (50% opacity)

    error: 'rgba(207, 102, 121, 1)', // Muted Red
    errorTransparent: 'rgba(207, 102, 121, 0.5)', // Muted Red (50% opacity)

     // Light mode message colors
     messageIncoming: '#FFFFFF',          // White for incoming
     messageOutgoing: '#E7FFDB',         // WhatsApp light green for outgoing
     messageIncomingDark: '#202C33',     // WhatsApp dark mode incoming
     messageOutgoingDark: '#005C4B',     // WhatsApp dark mode outgoing
     messageSelected: 'rgba(0, 150, 136, 0.2)', // Selection color
     
     // Message text colors
     messageTextIncoming: '#111B21',      // WhatsApp dark gray
     messageTextOutgoing: '#111B21',      // Same dark gray for outgoing
     messageTextDark: '#E9EDEF',         // WhatsApp dark mode text
     
     // Timestamp colors
     messageTimestamp: '#667781',        // WhatsApp timestamp gray
     messageTimestampDark: '#8696A0',  
  },
};

export default Colors;
