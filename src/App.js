import React, { Component, Fragment } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: {
        shortLink: null
      },
      isDone: false
    }
  }
  render() {
   

    const link = (
        <div className='Link'>
          <p>Here's your link</p>
          <a href={this.state.link.shortLink}>{this.state.link.shortLink}</a>
        </div>
        );
    return (
      <div className='App'>
        <h1>Url Shortener Microservice</h1>
        <Formik
          initialValues={{ url: '' }}
          validate={values => {
          let errors = {};
          if (!values.url) {
            errors.url = 'Required';
          } else if (
            !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g.test(values.url)
          ) {
            errors.url = 'Invalid URL address';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          fetch('https://url-shortener-server.herokuapp.com/api/shorturl/new', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
              'Content-Type' : 'application/json'
            }
          }).then(res => {
            setSubmitting(false);
            return res.json()
          }).then(res => {
            if(res.url === undefined) {
              return;
            }
            this.setState({
              link: {
                shortLink: 'https://url-shortener-server.herokuapp.com/api/shorturl/' + res.url
              },
              isDone: true
            })
          }).catch(err => console.log(err))
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="url" />
            <ErrorMessage name="url" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      {this.state.isDone ? link : null}
    </div>
    )
  }
}

export default App;