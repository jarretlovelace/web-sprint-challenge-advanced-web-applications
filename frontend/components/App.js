import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() { // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();
  // ✨ Research `useNavigate` in React Router v.6

  const redirectToLogin = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };
 
  const logout = () => {    // ✨ implement
    localStorage.removeItem('token');   // If a token is in local storage it should be removed,
    setMessage('Goodbye!');  // and a message saying "Goodbye!" should be set in its proper state.
   setArticles([]);
   setCurrentArticleId(null);
   navigate('/');
      // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  };

  const login = (credentials) => {
    setMessage('');// We should flush the message state, turn on the spinner
    setSpinnerOn(true); // turn on the spinner
    axios.post(loginUrl, credentials)// and launch a request to the proper endpoint.
      .then(res => {
        console.log('Login successful:', res.data);
        localStorage.setItem('token', res.data.token); // On success, we should set the token to local storage in a 'token' key,
        setMessage(res.data.message);// put the server success message in its proper state, 
        redirectToArticles();  // and redirect to the Articles screen.
      })
      .catch(err => {
        console.error('Login error:', err.response ? err.response.data : err);
        setMessage(err.response ? err.response.data.message : 'Login failed');
      })
      .finally(() => {
        setSpinnerOn(false); // Don't forget to turn off the spinner! 
      });
  };

  const getArticles = () => {  // ✨ implement
    setMessage(''); // We should flush the message state, 
    setSpinnerOn(true); // turn on the spinner
    const token = localStorage.getItem('token');  // and launch a request to the proper endpoint.
    axios.get(articlesUrl, { headers: { Authorization: token } })
      .then(res => {
        setArticles(res.data);// On success, we should set the articles in their proper state and
        setMessage('Articles fetched successfully');// put the server success message in its proper state.
      })
      .catch(err => {
        console.error('Get articles error:', err.response ? err.response.data : err);
        if (err.response && err.response.status === 401) {  // If something goes wrong, check the status of the response:
          redirectToLogin();
        } else {
          setMessage(err.response ? err.response.data.message : 'Failed to fetch articles');
        }
      })
      .finally(() => {
        setSpinnerOn(false); // Don't forget to turn off the spinner! 
      });
  };

 
  const postArticle = (article) => {// ✨ implement
    setMessage('');// We should flush the message state,
    setSpinnerOn(true); // turn on the spinner
    const token = localStorage.getItem('token'); // and launch a request to the proper endpoint.
    axios.post(articlesUrl, article, { headers: { Authorization: token } })
      .then(res => {
        setArticles([...articles, res.data]); // On success, we should set the articles in their proper state and
        setMessage('Article posted successfully');// put the server success message in its proper state.
      })
      .catch(err => {
        console.error('Post article error:', err.response ? err.response.data : err);
        setMessage(err.response ? err.response.data.message : 'Failed to post article'); // If something goes wrong, check the status of the response:
      })
      .finally(() => {
        setSpinnerOn(false); // Don't forget to turn off the spinner! 
      });
  };

  const updateArticle = (articleData) => {// ✨ implement
    setMessage(''); // We should flush the message state,
    setSpinnerOn(true);// turn on the spinner
    const token = localStorage.getItem('token');// and launch a request to the proper endpoint.
    axios.put(`${articlesUrl}/${articleData.article_id}`, articleData, { headers: { Authorization: token } })
      .then(res => {
        setArticles(articles.map(article => article.article_id === articleData.article_id ? res.data : article));
        setMessage('Article updated successfully');
      })
      .catch(err => {
        console.error('Update article error', err.response ? err.response.data : err);
        setMessage(err.response ? err.response.data.message : 'Failed to update article');
      })
      .finally(() => {
        setSpinnerOn(false);// Don't forget to turn off the spinner! 
      });
  };

  const deleteArticle = (article_id) => {// ✨ implement
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token');
    axios.delete(`${articlesUrl}/${article_id}`, { headers: { Authorization: token } })
      .then(res => {
        setArticles(articles.filter(article => article.article_id !== article_id));
        setMessage('Article deleted successfully');
      })
      .catch(err => {
        console.error('Delete article error:', err.response ? err.response.data : err);
        setMessage(err.response ? err.response.data.message : 'Failed to delete article');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getArticles();
    }
    }, []);

    return (
      <div>
        {spinnerOn && <Spinner />}
        <Message message={message} />
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
          <button onClick={logout}>Logout</button>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="/articles" element={<Articles
            articles={articles}
            getArticles={getArticles}
            deleteArticle={deleteArticle}
            setCurrentArticleId={setCurrentArticleId}
            postArticle={postArticle}
            updateArticle={updateArticle}
            currentArticle={articles.find(article => article.article_id === currentArticleId) || null}
          />} />
        </Routes>
      </div>
    );
  }