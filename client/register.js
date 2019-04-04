const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;

  let request = {
    variables: {
      username,
      email,
      password,
      firstname,
      lastname,
    },
    query: `
      mutation AddUser($username: String!, $email: String!, $password: String!, $firstname: String!, $lastname: String!) {
        addUser(username: $username, email: $email, password: $password, firstname: $firstname, lastname: $lastname) {
          id
          username
        }
      }
    `
  };

  const registerData = {
    username,
    email,
    password,
    firstname,
    lastname,
  };

  // http://localhost:4000/graphql
  // https://backend-only.herokuapp.com/graphql

  // const url = 'https://backend-only.herokuapp.com/graphql';
  const url = 'http://localhost:5555/api/auth/register';
  // const url = 'http://localhost:5555/graphql';

  const response = async () => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      let jsonRes = await res.json();

      return jsonRes;
    } catch (error) {
      throw error;
    }
  };

  const data = await response();
  console.log(data);

});
