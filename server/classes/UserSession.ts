import { IdToken } from "./IdToken";

export interface ICurrentEnsemble {
  id: string;
  registrationId: string;
  isLastEnsemble: boolean;
}

export type UserSessionSerialized = {
  idToken: IdToken;
  currentEnsemble?: ICurrentEnsemble;
};

interface IUserSessionConstructorParams {
  idToken: IdToken;
  currentEnsemble?: ICurrentEnsemble;
}

class UserSession {
  public idToken: IdToken;
  public currentEnsemble?: ICurrentEnsemble;

  constructor(params: IUserSessionConstructorParams) {
    this.idToken = params.idToken;
    this.currentEnsemble = params.currentEnsemble;
  }

  public serialize(): UserSessionSerialized {
    return {
      idToken: this.idToken,
      currentEnsemble: this.currentEnsemble
    };
  }

  public deSerialize(): UserSession {
    return new UserSession({
      idToken: this.idToken,
      currentEnsemble: this.currentEnsemble
    });
  }

  // Mappings from the idToken to important props
  // https://docs.google.com/document/d/1p8i9OUf4v2e-ZglfvqmHcrLjc3ZoDAJLF8huGzhgyw8/edit#
  public getUserId(): string {
    return this.idToken.sub;
  }
  public getPlatformId(): string {
    return this.idToken.iss;
  }
  public getCourseId(): string {
    return this.idToken["https://purl.imsglobal.org/spec/lti/claim/context"].id;
  }
  public getActivityId(): string {
    return this.idToken["https://purl.imsglobal.org/spec/lti/claim/custom"]
      .identRef;
  }
}

export default UserSession;
