import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()

  // ✨ Research `useNavigate` in React Router v.6
  const redirectToLogin = () => navigate('/');
  const redirectToArticles = () => navigate('/articles');

  const logout = () => {
    // ✨ implement
    localStorage.removeItem('token');
    // If a token is in local storage it should be removed,
    setMessage('Goodbye!');
    // and a message saying "Goodbye!" should be set in its proper state.
    redirectToLogin();
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  };

  const login = async ({ username, password }) => {
    // ✨ implement
    setMessage('');
    setSpinnerOn(true);
    // We should flush the message state, turn on the spinner
    try {
      const response = await axios.post(loginUrl, { username, password });
    // and launch a request to the proper endpoint.
    localStorage.setItem('token', response.data.token);
    // On success, we should set the token to local storage in a 'token' key,
    setMessage(response.data.message);
    // put the server success message in its proper state, and redirect
    redirectToLogin();
    // to the Articles screen. Don't forget to turn off the spinner! 
  } catch (err) {
    setMessage(err.response.data.message || 'Login failed');
  } finally {
    setSpinnerOn(false);
  }
  };

  const getArticles = async () => {
    // ✨ implement
    setMessage('');
    setSpinnerOn(true);
    // We should flush the message state, turn on the spinner
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(articlesUrl, {
        headers: { Authorization: token }
      });
    // and launch an authenticated request to the proper endpoint.
    setArticles(response.data);
    // On success, we should set the articles in their proper state and
    setMessage('Aricles fetched successfully');
    // put the server success message in its proper state.
    } catch (err) {
      if (err.response && err.response.status === 401) {
        redirectToLogin(); 
      } else {
        setMessage(err.responses ? err.responding.data.message : 'Failed to fetch articles');
      }
    } finally {setSpinnerOn(false);
    }
     // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  };

  const postArticle = async (article) => {
    setMessage('');
    // ✨ implement
    setSpinnerOn(true);
    // The flow is very similar to the `getArticles` function.
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(articlesUrl, article, {
        headers: { Authorization: token }
      });
      setArticles([...articles, response.data.articles]);
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response ? err.response.data.message : 'Failed to create article');
    } finally {
      setSpinnerOn(false);
    }
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  };

  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);
    // ✨ implement
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: { Authorization: token }
      });
      setArticles(articles.map(a => (a.id === article_id ? response.data.article : a)));
      setMessage(response.data.message || 'Failed to update article');
    } finally {
      setSpinnerOn(false);
    }
    };
    // You got this!
  

    const deleteArticle = async (article_id) => {
      setMessage('');
      setSpinnerOn(true);
    // ✨ implement
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: { Authorization: token }
      });
      setArticles(articles.filter(a => a.id !== article_id));
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response.data.message || 'Failed to delete article');
    } finally {
      setSpinnerOn(false);
    }
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
              postArticle={postArticle}
              updateArticle={updateArticle} 
              setCurrentArticleId={setCurrentArticleId}
              currentArticle={articles.find(article => article.article_id === currentArticleId) || null}
               />
              <Articles 
              articles={articles} 
              getArticles={getArticles} 
              deleteArticle={deleteArticle} 
              setCurrentArticleId={setCurrentArticleId} 
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}