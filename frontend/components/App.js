import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();
  const redirectToLogin = () => navigate("/");
  const redirectToArticles = () => navigate("/articles");

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    
    try {
      const response = await fetch(loginUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        setMessage('Login successful');
        await getArticles();
        redirectToArticles();
      } else {
        console.log('Login failed:', data);
        setMessage(data.message);
      }
    } catch (error) {
      console.log('Login error:', error);
      setMessage('An error occurred during login.');
    }

    setSpinnerOn(false);
  };

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found');
        redirectToLogin();
        return;
      }

      const response = await fetch(articlesUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json(); 

      if (response.ok) {
        console.log('Articles fetched:', data);
        setArticles(data);
        setMessage('Articles fetched successfully');
      } else {
        console.log('Failed to fetch articles:', data);
        if (response.status === 401) {
          redirectToLogin();
        }
        setMessage(data.message);
      }
    } catch (error) {
      console.log('Error fetching articles:', error);
      setMessage('An error occurred while fetching articles.');
    }

    setSpinnerOn(false);
  };

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(article)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Article posted successfully');
        await getArticles();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred while posting the article.');
    }

    setSpinnerOn(false);
  };

  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);

    try { 
      const token = localStorage.getItem('token');
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article)
      });
    
      const data = await response.json();

      if (response.ok) {
        setMessage('Article updated successfully');
        await getArticles();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred while updating the article.');
    }

    setSpinnerOn(false);
  };

  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Article deleted successfully');
        await getArticles();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred while deleting the article.');
    }

    setSpinnerOn(false);
  };

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
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
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                articles={articles}
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
