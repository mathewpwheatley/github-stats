# github-stats

This is a small tool used to track a few metrics. It is very much a MVP.
![github stats screenshot](/public/Screenshot_2023-03-01.png)
## Setup

### Install dependencies

Run `npm update`.
### Github personal access token

File `src/github/secrets.ts` must contain the constant `githubPersonalAccessToken` which is your Github personal access token used when calling Github's API.

```typescript
export const githubPersonalAccessToken: string =
  'your_github_personal_access_token';
```

You can create token via [Github](https://github.com/settings/tokens). This token must have permissions for repositories via the "Full control of private repositories" checkbox. For more information see [Github's documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). In addition, ensure you grant your token SSO access to your organization of interest.

## Usage

Run `npm start`. This will open a webpage at [localhost:3000](localhost:3000) which you can interact with. Simply enter the organization and login of interest and press the fetch button. Records for all of relevant pull requests and issues will be pulled so this fetch can take some time. All records are held in memory so you can quickly change the time period to be plotted without waiting for additional fetch requests.