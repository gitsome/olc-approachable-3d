// https://docs.google.com/document/d/1p8i9OUf4v2e-ZglfvqmHcrLjc3ZoDAJLF8huGzhgyw8/edit#
export type IdTokenContext = {
  id: string; // "f4197125cb918571dcd133c1e6e826d869de6c6e"
  label: string; // "INS-ETX"
  title: string; // "INS-ETX Prototype Course"
  type: string[]; // ["http://purl.imsglobal.org/vocab/lis/v2/course#CourseOffering"]
};
export type IdTokenResourceLink = {
  id: string; // "795d264085fa4250970d9f1f3c93980372ee416c"
  description: string; // ""
  title: string; // "OLI Torus Dev"
};
export type IdTokenEndpoint = {
  scope: string[];
  lineitems: string[];
  // and endpoint to submit information to like /scores
  lineitem: string; // "http://167.172.203.141:4000/api/v1/attempt/activity/a8754099-f770-43ea-b053-feeb574a99a6/part/cf0f8b57-2055-463c-a947-ee5d2060fbf6/outcome";
};
export type IdTokenCustom = {
  // to be returned in the AUTHENTICATION header back to the outcomes endpoints provided in IdTokentEndpoint.lineitem
  access_token: string; // "SFMyNTY.g2gDaANtAAAAJGE4NzU0MDk5LWY3NzAtNDNlYS1iMDUzLWZlZWI1NzRhOTlhNm0AAAAoZjQxOTcxMjVjYjkxODU3MWRjZDEzM2MxZTZlODI2ZDg2OWRlNmM2ZWEEbgYAs8gIMXMBYgABUYA.Zm9MHCyDDwtKuhQIBzlS29Qbp3n34B2HRdVIZWWJxHU"
  // the id of the activity to launch
  identRef: string; // "bf9db8ea-dc7d-4df8-86ab-efd3e75581b4"
};

export type IdToken = {
  // the id of the platform
  iss: string; // "http://167.172.203.141:4000"
  aud: string[]; // ["162fa4d8-bcbf-49a0-94b2-2de05ad274af"]
  iat: number; // 1594255527
  exp: number; // 1594255527
  // used to identify different requests
  nonce: string; // "fd020b78926745ebb3dc2005899f1d12"
  // the user id
  sub: string; //"a6d5c443-1f51-4783-ba1a-7686ffe3b54a"
  name: string; // "Mike Jones"
  email: string; // "https://canvas.instructure.com/images/messages/avatar-50.png"
  locale: string; // "en-US"
  "https://purl.imsglobal.org/spec/lti/claim/deployment_id": string; // "07940580-b309-415e-a37c-914d387c1150"
  "https://purl.imsglobal.org/spec/lti/claim/message_type": string; // "LtiResourceLinkRequest"
  "https://purl.imsglobal.org/spec/lti/claim/version": string; // "1.3.0"
  "https://purl.imsglobal.org/spec/lti/claim/roles": string[]; // ["http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student"]
  "https://purl.imsglobal.org/spec/lti/claim/context": IdTokenContext;
  "https://purl.imsglobal.org/spec/lti/claim/resource_link": IdTokenResourceLink;
  "https://purl.imsglobal.org/spec/lti-ags/claim/endpoint": IdTokenEndpoint;
  "https://purl.imsglobal.org/spec/lti/claim/custom": IdTokenCustom;
};
