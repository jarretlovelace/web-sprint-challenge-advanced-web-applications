import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
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
    redirectToLogin();   // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  };

  const login = (credentials) => {
    setMessage('');// We should flush the message state, turn on the spinner
    setSpinnerOn(true); // turn on the spinner
    axios.post(loginUrl, credentials)// and launch a request to the proper endpoint.
      .then(res => {
        console.log('Login Response:', res); // Log statement
        localStorage.setItem('token', res.data.token); // On success, we should set the token to local storage in a 'token' key,
        setMessage(res.data.message);// put the server success message in its proper state, 
        redirectToArticles();  // and redirect to the Articles screen.
      })
      .catch(err => {
        console.log('Login Error:', err.response); // Log statement
        setMessage(err.response.data.message);
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
        console.log('Get Articles Response:', res); // Log statement
        setArticles(res.data.articles);// On success, we should set the articles in their proper state and
        setMessage(res.data.message);// put the server success message in its proper state.
      })
      .catch(err => {
        console.log('Get Articles Error:', err.response); // Log statement
        if (err.response.status === 401) {  // If something goes wrong, check the status of the response:
          redirectToLogin();
        } else {
          setMessage(err.response.data.message);
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
        console.log('Post Article Response:', res); // Log statement
        setArticles([...articles, res.data.article]); // On success, we should set the articles in their proper state and
        setMessage(res.data.message);// put the server success message in its proper state.
      })
      .catch(err => {
        console.log('Post Article Error:', err.response); // Log statement
        setMessage(err.response.data.message); // If something goes wrong, check the status of the response:
      })
      .finally(() => {
        setSpinnerOn(false); // Don't forget to turn off the spinner! 
      });
  };

  const updateArticle = (articleData) => {// ✨ implement
    setMessage(''); // We should flush the message state,
    setSpinnerOn(true);// turn on the spinner
    const token = localStorage.getItem('token');// and launch a request to the proper endpoint.
    axios.put(`${articlesUrl}/${articleData.article_id}`, articleData.article, { headers: { Authorization: token } })
      .then(res => {
        console.log('Update Article Response:', res); // Log statement
        setArticles(articles.map(article => article.article_id === res.data.article.article_id ? res.data.article : article));
        setMessage(res.data.message);
      })
      .catch(err => {
        console.log('Update Article Error:', err.response); // Log statement
        setMessage(err.response.data.message);
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
        console.log('Delete Article Response:', res); // Log statement
        setArticles(articles.filter(article => article.article_id !== article_id));
        setMessage(res.data.message);
      })
      .catch(err => {
        console.log('Delete Article Error:', err.response); // Log statement
        setMessage(err.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  useEffect(() => {
    if (currentArticleId) {
      const currentArticle = articles.find(article => article.article_id === currentArticleId);
      setCurrentArticleId(currentArticle);
    }
  }, [currentArticleId, articles]);

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
          currentArticleId={currentArticleId}
        />} />
        <Route path="/articles/new" element={<ArticleForm
          postArticle={postArticle}
          updateArticle={updateArticle}
          setCurrentArticleId={setCurrentArticleId}
          currentArticle={articles.find(article => article.article_id === currentArticleId)}
        />} />
      </Routes>
    </div>
  );
}
