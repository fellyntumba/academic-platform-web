import { useState , useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { persistor } from '../../../store'
import { clearEnseignant } from '../../../enseignantSlice'
import { useNavigate } from 'react-router-dom'
import '../../../styles-pages/enseignant/main-form/Enseignant.css'
import { FaRightFromBracket  } from 'react-icons/fa6';
import {obtenirNomEnseign} from '../services/Enseignant'
import RepondreRecours from '../composants-forms/RepondreRecours';
import SaisirCotes from '../composants-forms/SaisirCotes';
import Footer from './Footer';
import socket from "../services/socket_enseign";


function Enseignant() {
  const idEnsei = useSelector((state) => state.enseignant.idEnseignant); 
  const [elementEnseign, setElementEnseign] = useState(0);
  const [nomEnseign, setNomEnseign] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [nbreRecours, setNbreRecours] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    
    socket.connect();

    socket.emit("teacher:connect", idEnsei);

    socket.on("teacher:recours", (data) =>{
      console.log("Nombre de recours non traités :", data['nombre'].total);
      setNbreRecours(data['nombre'].total);
    });

    return () => {
      // socket.off("teachers:online");
      socket.disconnect();
    };
  }, []);

  const onglets = [
    "Soumission de cotes", 
    "Traitement des recours"
  ]
  // Gère l' Appel API pour la nom de l'enseignant
  useEffect(()=>{
    const nomEnseignant  = async()=>{

      try {
        if (idEnsei){
          const nom = await obtenirNomEnseign(idEnsei);
          // console.log(nom);
          if (!nom.ok){
          console.log('Nom non retrouvé');
          }
          const data = await nom.json()
          setNomEnseign(data.nom);
        } else {
          console.log(idEnsei);
        }

      } catch (error) {
        console.log(error);
      }
    };
    nomEnseignant();
  }, []); 

  const  handleClick = () =>{
   if(elementEnseign == 1){
      return <RepondreRecours idEnsei={idEnsei}/> 
    }
   else if(elementEnseign == 0){
      return <SaisirCotes/>
    }

    
  }

  function getInitials(fullName){
    if (!fullName) return "";
    return fullName
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  }
  const initials = getInitials(nomEnseign)


  //fonction de Logout
  const handleLogout = async ()=>{
    //Reset Redux en memoire
    dispatch(clearEnseignant())

    //Vider le storage persistant(localStorage)
    await persistor.purge()

    //Redirige vers login
    navigate("/authEns")

  };


  return (
    <div className="app">
         <header className="header-enseign">
           
            <div > 
              <img src="logo.png" alt="" className="logo"/> 
              <p className='title-enseign'>Espace Enseignant</p>
            </div>
            
            <div className="grid-ens">
                {onglets.map((label, index) => (
                  <button key={index}  className={`${activeIndex === index? "teacher-tab-activ  ": "teacher-tab"}`}
                  onClick={ () => {
                    setElementEnseign(index);
                    setActiveIndex(index);
                    }}>{label}</button>
                ))}
                
            </div>
               {nbreRecours !=0 && <div className="recours-non-traites">{nbreRecours}</div>} 
         
            <div className="prof">
              <img
                src={`https://ui-avatars.com/api/?name=${initials}&background=fff&color=0d68f1&rounded=true`}
                alt="profil"
                className="prof-avatar"
              />
              <span>{`Prof. ${nomEnseign}`}</span>
            </div>
            <div >
              <button className='logout-btn-enseign'  onClick={handleLogout}><FaRightFromBracket /></button>
            </div>
         </header>
     
      <main className="content-enseign">
       {handleClick()} 
      </main>
        <Footer/>
    </div>
  )
}

export default Enseignant

