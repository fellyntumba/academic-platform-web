import {toast} from 'react-toastify' //Gère les notifications (succès ou erreur)

export  function ToastContairSucces(message) {
    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        className: "succes"
    });

}


export  function ToastContairErreur(message) {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        className: "erreur"
    });

}

