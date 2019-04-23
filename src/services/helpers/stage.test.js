import { getStageDetails } from 'sly/services/helpers/stage';
import { FAMILY_STAGE_ORDERED } from 'sly/constants/familyDetails';

describe('stage', () => {
  it('getStageDetails - showPauseButton is false in Prospects stage', () => {
    const stages = FAMILY_STAGE_ORDERED.Prospects;
    stages.forEach((s) => {
      const r = getStageDetails(s);
      expect(r.showPauseButton).toBeFalsy();
    });
  });

  it('getStageDetails - showPauseButton is true in Connected stage', () => {
    const stages = FAMILY_STAGE_ORDERED.Connected;
    stages.forEach((s) => {
      const r = getStageDetails(s);
      expect(r.showPauseButton).toBeTruthy();
    });
  });

  it('getStageDetails - showPauseButton is false in Closed stage', () => {
    const stages = FAMILY_STAGE_ORDERED.Closed;
    stages.forEach((s) => {
      const r = getStageDetails(s);
      expect(r.showPauseButton).toBeFalsy();
    });
  });
});
