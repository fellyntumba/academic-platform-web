import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { persistor } from '../../../../store'
import { clearFaculte } from '../../../../faculteSlice'
import { useNavigate } from 'react-router-dom'
import { FaRightFromBracket  } from 'react-icons/fa6';
import '../../../styles-pages/administrateur/main-form/Admin.css'
import EnregistrerEnseignant from '../composants-forms/EnregistrerEnseignant'
import Statistiques from '../Composants-Forms/Statistiques'
import EvolutionSoumissionNote from '../composants-forms/EvolutionSoumissionNote'
import TraitementRecours from '../composants-forms/TraitementRecours'
import ListesEtudiants from '../composants-forms/ListesEtudiants'
import Footer from './Footer'

//Testes des boutons menus
const onglets = [
  "Listes des étudiants",  "Mise à jour cours", , "Evolution de soumission des notes", 
  "Evolution de traitement des recours", 
  "Statistiques/Rapports"
]


export default function Admin() {
const [elementAdmin, setElementAdmin] = useState(0);
const [activeIndex, setActiveIndex]   = useState(null);
const faculte = useSelector((state) => state.faculte.nomFac);
console.log(faculte)

const fullState = useSelector((state) => state)
console.log(fullState)


const dispatch = useDispatch();
const navigate = useNavigate();
// console.log();

// Monte chaque composant après clic sur son bouton menu
const  handleClick = () =>{
    if (elementAdmin == 4){
      return <EvolutionSoumissionNote/>
    }
    else if(elementAdmin == 3){
      return <Statistiques/>
    }
    else if(elementAdmin == 2){
      return <TraitementRecours/>
    }
    else if(elementAdmin == 1){
      return  <EnregistrerEnseignant/>
    }
    else if(elementAdmin == 0){
      return  <ListesEtudiants/>
    }

}

//fonction de Logout
const handleLogout = async ()=>{
  //Reset Redux en memoire
  dispatch(clearFaculte())

  //Vider le storage persistant(localStorage)
  await persistor.purge()

  //Redirige vers login
  navigate('/authAdm')

};

  return (
    <div className="container-adm">
      {/* Header */}
      <div className='header-adm'>
        <div className='header-logo-title'>
          <img src="/logo.png" alt="Université logo" className='logo'/>
          {/* <h1>DéliberationApp.</h1> */}
        </div>
        <h3 className="title-adm">Administration/{faculte}</h3>
        <div className="grid-adm">
          {onglets.map((label, index) => (
            <button key={index} className={`${activeIndex === index? "admin-tab-activ ": "admin-tab "}`}
            onClick={ () => {
                setElementAdmin(index);
                setActiveIndex(index);
            }}>{label}</button>
          ))}
          <div>
            <button className='logout-btn-admin'  onClick={handleLogout}><FaRightFromBracket /></button>
          </div>
        </div>
      </div>

      {/* Composant principal */}
      <main className="content-adm">
          {handleClick()} 
      </main>
      
      {/* Footer */}
      <Footer />
   
    </div>

  );
}



