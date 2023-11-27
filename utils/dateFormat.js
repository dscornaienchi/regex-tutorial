module.exports = (timestamp) => {
    const dateObject = new Date(timestamp);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return dateObject.toLocaleDateString(undefined, options);
  };
  