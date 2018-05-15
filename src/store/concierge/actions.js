export const GET_DETAILED_PRICING = 'GET_DETAILED_PRICING';
export const getDetailedPricing = ({ conversionSubmitted }) => ({
  type: GET_DETAILED_PRICING,
  payload: { conversionSubmitted }
});

export const NEXT = 'concierge/NEXT';
export const next = () => ({ type: NEXT });

export const CLOSE = 'concierge/CLOSE';
export const close = () => ({ type: CLOSE });

export const GOTO_STEP = 'concierge/GOTO_STEP';
export const gotoStep = step => ({ step, type: GOTO_STEP });

