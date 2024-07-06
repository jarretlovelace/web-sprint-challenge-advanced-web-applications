// frontend/components/ArticleForm.js
import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm(props) {
  const { postArticle, updateArticle, currentArticleId, setCurrentArticleId, articles } = props;
  const [values, setValues] = useState(initialFormValues);

  useEffect(() => {
    const currentArticle = articles.find(article => article.article_id === currentArticleId);
    if (currentArticle) {
      setValues({
        title: currentArticle.title,
        text: currentArticle.text, 
        topic: currentArticle.topic,
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticleId, articles]);

  const onChange = evt => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = evt => {
    evt.preventDefault();
    if (currentArticleId) {
      updateArticle({ article_id: currentArticleId, article: values });
    } else {
      postArticle(values);
    }
    setValues(initialFormValues);
    setCurrentArticleId(null);
  };

  const isDisabled = () => {
    return !(values.title.trim() && values.text.trim() && values.topic.trim());
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticleId ? 'Edit' : 'Create'} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button type="button" onClick={() => setCurrentArticleId(null)}>Cancel edit</button>
      </div>
    </form>
  );
}

ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number,
  articles: PT.arrayOf(PT.shape({
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
};
