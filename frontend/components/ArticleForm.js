import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm({ postArticle, updateArticle, setCurrentArticleId, currentArticle }) {
  const [formValues, setFormValues] = useState(initialFormValues);  // ✨ where are my props? Destructure them here

  useEffect(() => {    // ✨ implement
    if (currentArticle) {    // Every time the `currentArticle` prop changes, we should check it for truthiness:
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
      updateArticle({ article_id: currentArticle.article_id, article: formValues });
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
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
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


// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
};