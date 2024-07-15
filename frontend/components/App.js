import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]); // Initialize as an array
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = () => {
    setArticles([]);
    setCurrentArticleId(null);
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    setArticles([]);
    setCurrentArticleId(null); 
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    navigate('/');
  };

  const login = (credentials) => {
    setMessage('');
    setSpinnerOn(true);
    axios.post(loginUrl, credentials)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
      })
      .catch(err => {
        setMessage(err.response ? err.response.data.message : 'Login failed');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setMessage('');
    setSpinnerOn(true);
    axios.get(articlesUrl, { headers: { Authorization: token } })
      .then(res => {
        setArticles(res.data);
        setMessage('Here are your articles, jarret!');
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          redirectToLogin();
        } else {
          setMessage(err.response ? err.response.data.message : 'Failed to fetch articles');
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token');
    axios.post(articlesUrl, article, { headers: { Authorization: token } })
      .then(res => {
        setArticles([...articles, res.data]);
        setMessage('Article posted successfully');
      })
      .catch(err => {
        setMessage(err.response ? err.response.data.message : 'Failed to post article');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const updateArticle = (articleData) => {
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token');
    axios.put(`${articlesUrl}/${articleData.article_id}`, articleData, { headers: { Authorization: token } })
      .then(res => {
        setArticles(articles.map(article => article.article_id === articleData.article_id ? res.data : article));
        setMessage('Article updated successfully');
      })
      .catch(err => {
        setMessage(err.response ? err.response.data.message : 'Failed to update article');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token');
    axios.delete(`${articlesUrl}/${article_id}`, { headers: { Authorization: token } })
      .then(res => {
        setArticles(articles.filter(article => article.article_id !== article_id));
        setMessage('Article deleted successfully');
      })
      .catch(err => {
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

  const currentArticle = Array.isArray(articles) ? articles.find(article => article.article_id === currentArticleId) : null;

  return (
    <div className="App">
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <nav>
        <NavLink id="loginScreen" to="/">Login</NavLink>
        <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        <button onClick={logout}>Logout of app</button>
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
          currentArticle={currentArticle}
        />} />
      </Routes>
    </div>
  );
}
