import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm({ postArticle, updateArticle, setCurrentArticleId, currentArticle }) {
  const [formValues, setFormValues] = useState(initialFormValues);

  useEffect(() => {
    if (currentArticle) {
      setFormValues(currentArticle);
    } else {
      setFormValues(initialFormValues);
    }
  }, [currentArticle]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentArticle) {
      updateArticle({ ...formValues, article_id: currentArticle.article_id });
    } else {
      postArticle(formValues);
    }
    setFormValues(initialFormValues);
    setCurrentArticleId(null);
  };

  const isDisabled = () => {
    return !(formValues.title && formValues.text && formValues.topic);
  };

  const onCancel = () => {
    setFormValues(initialFormValues);
    setCurrentArticleId(null);
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <h2>{currentArticle ? 'Edit' : 'Create'} Article</h2>
      <label htmlFor="title">Title</label>
      <input
        maxLength={50}
        onChange={handleChange}
        value={formValues.title}
        placeholder="Enter title"
        id="title"
      />
      <label htmlFor="text">Enter text</label>
      <textarea
        maxLength={200}
        onChange={handleChange}
        value={formValues.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={handleChange} id="topic" value={formValues.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {currentArticle && <button type="button" onClick={onCancel}>Cancel edit</button>}
      </div>
    </form>
  );
}

ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
};
