const signInButton = document.getElementById('signin');
const signOutButton = document.getElementById('signout');
const getUsersButton = document.getElementById('get-users');

const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

getCredentials = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  return { email, password };
}

signInButton.addEventListener('click', async (e) => {
  e.preventDefault();

  // const url = 'http://localhost:4000/graphql';
  // const url = 'https://backend-only.herokuapp.com/graphql';
  const url = 'http://localhost:5555/api/auth/login';
  // const url = 'https://demons-auth.herokuapp.com/api/auth/login';

  const loginData = getCredentials(emailField.value, passwordField.value);

  // TODO: check if all headers are needed
  const fetchParams = {
    body: JSON.stringify(loginData),
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    },
    credentials: 'include'
  };

  const response = async () => {
    try {
      const res = await fetch(url, fetchParams);
      if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  await response();
  // const data = await response();

  // alternative
  // localStorage.setItem('jwt', data.token);
});

signOutButton.addEventListener('click', async () => {
  const url = 'http://localhost:5555/api/auth/logout';
  const fetchParams = {
    method: 'POST',
    credentials: 'include'
  };

  const response = async () => {
    try {
      const res = await fetch(url, fetchParams);
      if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  // const data = await response();
  await response();
});

getUsersButton.addEventListener('click', async () => {
  const url = 'http://localhost:5555/api/auth/users';
  const fetchParams = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Cache': 'no-cache',
      'Access-Control-Allow-Credentials': 'true'
    },
    credentials: 'include'
  };

  const response = async () => {
    try {
      const res = await fetch(url, fetchParams);

      if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');

      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  const data = await response();

  console.log(data);

  // axios.get(url, {withCredentials: true});
});
