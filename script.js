require([
  'esri/portal/Portal',
  'esri/identity/OAuthInfo',
  'esri/identity/IdentityManager',
], (Portal, OAuthInfo, IdentityManager) => {
  // UI elements
  const loginButton = document.querySelector('#login-button');
  const logoutButton = document.querySelector('#logout-button');
  const greeting = document.querySelector('h1');

  const info = new OAuthInfo({
    appId: 'CuZgHdDl3ILnzfGU',
    popup: false,
    //portalUrl: 'https://mywebsite.com/arcgis'
  });

  IdentityManager.registerOAuthInfos([info]);

  loginButton.addEventListener('click', () =>
    IdentityManager.getCredential(info.portalUrl + '/sharing')
  );

  logoutButton.addEventListener('click', () => {
    IdentityManager.destroyCredentials();
    window.location.reload();
  });

  const handleLoginSuccess = () => {
    const portal = new Portal();
    portal.authMode = 'immediate';
    portal.load().then(() => {
      console.log(portal);
      // When the user is successfully logged in...
      // ... hide the login button
      loginButton.style = 'display: none';
      // ... show the logout button
      logoutButton.style = 'display: inline-block';
      // ... greet the user by the user's name
      greeting.textContent = `Welcome back, ${portal.user.fullName}!`;
    });
  };

  IdentityManager.checkSignInStatus(info.portalUrl + '/sharing')
    .then(handleLoginSuccess)
    .catch(() => console.log('Not logged in'));
});
