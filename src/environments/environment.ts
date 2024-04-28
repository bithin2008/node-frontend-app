// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  name: 'dev',
  version: require('../../package.json').version + '-dev',
  production: false,
  vanillaSoftId:'',
  apiBaseUrl: "http://localhost:5000/api/v1/", // http://localhost:5000/api/v1/
  mockAPIUrl: "http://localhost:7878/",
  siteKey:"6LdQtncpAAAAAE1EUrYQHpzDd4v3kSOvsm0NlnL9",
  useMockServer: false
};
//https://api.techdevelopments.co/api/v1/
//https://fphwapi.techdevelopments.co/api/v1/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
