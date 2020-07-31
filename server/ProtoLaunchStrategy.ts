import passport from "passport-strategy";
import UserSession from "./classes/UserSession";
import { IdToken } from "./classes/IdToken";

class ProtoLaunchAuthStrategy extends passport.Strategy {
  public name = "protolaunch";

  constructor() {
    super();
  }

  public authenticate(req: any, options: any): any {
    // TODO add more robust validation... maybe annotated Yup validations in the IdToken type file and convert everything to a class instead of a type?
    const idToken = JSON.parse(req.body.id_token) as IdToken;

    // for now, minimal validation on providing a sub
    if (idToken.sub) {
      // send back the final object that will be attached to the user session as "user"
      const userSession = new UserSession({ idToken });
      return this.success(userSession);
    }

    return this.error(new Error("sub not provided"));
  }
}

export default ProtoLaunchAuthStrategy;
