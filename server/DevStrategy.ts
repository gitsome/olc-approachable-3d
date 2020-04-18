import passport from 'passport-strategy';

class DevStrategy extends passport.Strategy {

  public name = 'lti';

  constructor () {
    super();
  }

  public authenticate (req: any, options: any) {
    return this.success({
      user_id: 'dev'
    });
  }
};

export default DevStrategy;