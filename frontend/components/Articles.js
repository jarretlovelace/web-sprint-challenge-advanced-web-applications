import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PT from 'prop-types';
import ArticleForm from './ArticleForm';

const Articles = ({
  articles,
  getArticles,
  deleteArticle,
  setCurrentArticleId,
  postArticle,
  updateArticle,
  currentArticle,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (token && isLoggedIn) {
      getArticles();
    }
  }, [token, isLoggedIn, getArticles]);

  if (!token || !isLoggedIn) {
    return (
      <div>
        <h1>Goodbye!</h1>
        <Navigate to="/" replace />
      </div>
    );
  }

  return (
    <div className="articles-container">
      <button onClick={handleLogout}>Logout</button>
      <h2>Create Article</h2>
      <ArticleForm
        postArticle={postArticle}
        updateArticle={updateArticle}
        setCurrentArticleId={setCurrentArticleId}
        currentArticle={currentArticle}
      />
      <h2>Articles</h2>
      {Array.isArray(articles) && articles.length === 0 ? (
        <div>No Articles Available</div>
      ) : (
        Array.isArray(articles) && articles.map(article => (
          <div key={article.article_id} className="article">
            <h3>{article.title}</h3>
            <p>{article.text}</p>
            <p>Topic: {article.topic}</p>
            <div>
              <button onClick={() => setCurrentArticleId(article.article_id)}>Edit</button>
              <button onClick={() => deleteArticle(article.article_id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

Articles.propTypes = {
  articles: PT.arrayOf(
    PT.shape({
      article_id: PT.number.isRequired,
      title: PT.string.isRequired,
      text: PT.string.isRequired,
      topic: PT.string.isRequired,
    })
  ).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  currentArticle: PT.object,
};

export default Articles;
