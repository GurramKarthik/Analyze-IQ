import { toast } from 'react-toastify';

// <ToastContainer/> is mandatotry to show the toast. So it is add to app component

export const ToastMessage = (heading, message) => {

    toast(<div><strong>{heading}</strong><p>{message}</p></div>,{
        position: "top-right",
        hideProgressBar: true,
        autoClose: 3000,
        theme: "light",
      })
}

