import { MeetupPage } from './app.po';

describe('meetup App', () => {
  let page: MeetupPage;

  beforeEach(() => {
    page = new MeetupPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
