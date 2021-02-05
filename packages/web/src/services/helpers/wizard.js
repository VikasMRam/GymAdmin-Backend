export const getModalFromEntry = (entry) => {
  // Define which modal you want to display from entry
  switch (entry) {
    case 'communityPricing':
    case 'communitySidebar':
    case 'pricingTable':
      return 'communityPricing';
    case 'searchList':
    case 'communityOptions':
    case 'generalOptions':
      return 'generalRecommendations';
    default:
      return 'speakExpert';
  }
};

export const getWizardContentFromCta = (entry) => {
  // Define which modal you want to display from entry
  switch (entry) {
    case 'communityPricing':
    case 'communitySidebar':
    case 'pricing':
    case 'pricingTable':
      return  {
        intro: { showSkipOption: true,
          startButtonText: 'Let\'s get started',
          title: 'We need to ask a few quick questions to understand your needs.',
          description: 'Since pricing can vary depending on your preferences and care needs, you’ll get more accurate, up-to-date information working with a Seniorly Local Advisor.' },
        signup: { heading: 'Thanks! Your information helps us understand your needs and make personalized recommendations.',
          description: 'We’ll send your request and connect you with one of our Seniorly Local Advisors who will help you with pricing and availability.',
          submitButtonText: 'Get pricing',
        },
      };
    case 'searchList':
    case 'communityOptions':
    case 'generalOptions':
      return  {
        intro: { showSkipOption: false,
          title: 'We need to ask a few quick questions so we can make the best recommendations for your location, needs, and budget.',
          description: '',
          startButtonText: 'Let\'s get started',
        },
        signup: { heading: 'Thanks! Your preferences inform our Smart Search so we can recommend the right communities for you.',
          description: 'We’ll send your request and connect you with one of our local experts who can answer your questions about senior living communities in your area.',
          submitButtonText: 'Sign up to submit your request' },
      };
    case 'speakExpert':
      return  {
        intro: { showSkipOption: false,
          title: 'We need to ask a few quick questions to help our Seniorly Local Advisor understand your timing, needs, and budget.',
          description: '',
          startButtonText: 'Let\'s get started' },
        signup: { heading: 'Thanks! Your information helps our Seniorly Local Advisor understand your timing, needs, and budget.',
          description: 'We’ll send your request and connect you with one of our local experts who can answer your questions about senior living communities in your area.',
          submitButtonText: 'Sign up to submit your request'  },
      };
    default:
      return  {
        intro: { showSkipOption: false,
          startButtonText: 'Let\'s get started',
          title: 'We need to ask a few quick questions to understand your needs',
          description: 'Since pricing can vary depending on your preferences and care needs, you’ll get more accurate, up-to-date information working with a Seniorly Local Advisor.' },
        signup: { heading: 'Since pricing can vary depending on your preferences and care needs, you’ll get more accurate, up-to-date information working with a Seniorly Local Advisor.',
          description: 'We’ll send your request and connect you with one of our Seniorly Local Advisor who will help you with pricing and availability.',
          submitButtonText: 'Sign up to submit your request'  },
      };
  }
};
