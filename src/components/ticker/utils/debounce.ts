const debounce = (fn, time) => {
  let timeout;

  return function () {
    function functionCall() {
      fn.apply(this, arguments);
    }

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

export default debounce;
