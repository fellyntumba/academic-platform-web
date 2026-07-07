import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
//import {toast, ToastContainer} from 'react-toastify' //Gère les notifications (succès ou erreur)
import { ToastContairSucces, ToastContairErreur } from "../services/ToastContair";
import "../../../styles-pages/administrateur/composants-Styles/EnregistrerEnseignant.css";
import { FaTrashCan, FaPencil, FaPlus } from 'react-icons/fa6';
import { findPromotionsByFac,
    getEnseignants,addCoursEnseig,
    addCoursWithEnseig, getEmailsEnseign,
    findInfosByEmail, updateEnseign} from "../services/EnregistrerEnseignant";


export default function App() {
  const faculte = useSelector((state) => state.faculte.nomFac); // Prends le nom de la faculté
  
  // Ajouter un cours
  const [listePromotions, setListePromotions] = useState(null) //Prends la liste de promotions
  const [selectPromotion, setSelectPromotion] = useState('') //Prends la promotion séléctionnée
  const [listeEnseignants, setListeEnseignants] = useState(null) //Prends la liste des enseignants
  const [selectEnseignant, setSelectEnseignant] = useState('') // Prends l' enseignant séléctionné
  const [cours, setCours] = useState('') // Prends l'intitulé de cours
  const [ponderation, setPonderation] = useState('') // Prends la pondération
  const [nomEnseign, setNomEnseign] = useState('') // Prends nom complet de l'enseignant
  const [email, setEmail] = useState('') // Prends email de l'enseignant
  const [telephone, setTelephone] = useState('') // Prends telephone de l'enseignant

  // Mise à jour enseignant
  const [listeEmails, setListeEmails] = useState(null) //Prends la liste des emails
  const [selectEmail, setSelectEmail] = useState('') // Prends l' email séléctionné
  const [nomModif, setNomModif] = useState('') // Prends le nom à modifier
  const [emailModif, setEmailModif] = useState('') // Prends l'email à modifier
  const [telModif, setTelModif] = useState('') // Prends le tel à modifier

// console.log(faculte);
  
// Gère l' Appel API pour la liste des promotions
  useEffect(()=>{
    const listPromotion  = async()=>{

      try {
        if (faculte){
          const promotions = await findPromotionsByFac(faculte);
          // console.log(promotions);
          if (!promotions.ok){
          console.log('Promotions non retrouvées');
           }
          const data = await promotions.json()
          setListePromotions(data);
        } else if (!faculte){
          // Renvoyer à l' authentification
        }

      } catch (error) {
        console.log(error);
      }
    };
    listPromotion();
  }, []);
  // console.log(listePromotions)

// Gère l' Appel API pour la liste des enseignants
  useEffect(()=>{
    const tousEnseignants  = async()=>{

      try {
          const enseignants = await getEnseignants();
          // console.log(promotions);
          if (!enseignants.ok){
          console.log('Enseignants non retrouvées');
           }
          const data = await enseignants.json()
          setListeEnseignants(data);

      } catch (error) {
        console.log(error);
      }
    };
    tousEnseignants();
  }, []);

// Gère l' Appel API pour l' ajout du cours(avec ancien enseignant)
  const addCours = async()=>{
    // e.preventDefault();
    try {

      const result = await addCoursEnseig(cours, selectEnseignant, selectPromotion, ponderation);
      if(!result.ok ){
        ToastContairErreur('Cours non enregistré');
        console.log('Cours non enregistré');

      }else{
        ToastContairSucces(`Cours de ${cours} enregistré`);
        console.log('Cours enregistré');
      }
      
    } catch (error) {
      ToastContairErreur('Une erreur s\'est produite');
      console.log(error);
    }
  }

  // Gère l' Appel API pour l' ajout du cours(avec nouvel enseignant)
  const addWithCours = async()=>{
    // e.preventDefault();
    try {

      const result = await addCoursWithEnseig(cours, selectPromotion, ponderation, nomEnseign, email, telephone);
      if(!result.ok ){
        ToastContairErreur('Cours et enseignant non enregistrés');
        console.log('Cours et enseignant non enregistrés');

      }else{
        ToastContairSucces(`Cours ${cours} et ${nomEnseign} enregistrés`);
        console.log('Cours et enseignant enregistrés');
      }
      
    } catch (error) {
      ToastContairErreur('Une erreur s\'est produite');
      console.log(error);
    }
  }
  //Selection de l' enseignant ou non
  const addSubmit = (e)=>{
    e.preventDefault()
    if (selectEnseignant===''){
      addWithCours()
      // console.log(`enseignant : ${selectEnseignant}`);
      // console.log(cours, selectPromotion, ponderation, nomEnseign, email, telephone);
    } else {
      addCours()
      // console.log(`enseignant : ${selectEnseignant}`);
      // console.log(cours, selectEnseignant, selectPromotion, ponderation);
    }

  }

  // Gère l' Appel API pour les emails des enseignants
  useEffect(()=>{
    const emailsEnseign  = async()=>{

      try {
          const emails = await getEmailsEnseign();
          // console.log(promotions);
          if (!emails.ok){
          console.log('Enseignants non retrouvées');
           }
          const data = await emails.json()
          setListeEmails(data);

      } catch (error) {
        console.log(error);
      }
    };
    emailsEnseign();
  }, []);

  // Gère l' Appel API infos enseignants
  useEffect(()=>{
    const getInfosEnseign = async()=>{
        try {

          if (selectEmail!=''){
            const result = await findInfosByEmail(selectEmail);
        
            console.log(result);
            

            if(!result.ok ){
              // console.log(result);
              ToastContairErreur('Infos non trouvées');
              console.log('Infos non trouvées');

            }else{
              const data = await result.json()
              setNomModif(data.nom)
              setEmailModif(data.email)
              setTelModif(data.telephone)
              console.log('Infos trouvées');
              console.log(data);
            }
          } else{
              setNomModif('')
              setEmailModif('')
              setTelModif('')
              console.log('Infos non trouvées');
          }
        
      } catch (error) {
        ToastContairErreur('Une erreur s\'est produite');
        console.log(error);
      }
    }
    getInfosEnseign()

  },[selectEmail]);

  //Gère l' Appel API pour la mise à jour enseignant
  const updateEnseignByEmail = async(e)=>{
    e.preventDefault();
    try {

      const result = await updateEnseign(nomModif, emailModif, telModif, selectEmail);
      if(!result.ok ){
        ToastContairErreur('Enseignant non mis à jour');
        console.log('Enseignant non mis à jour');

      }else{
        ToastContairSucces(`Enseignant mis à jour'`);
        console.log('Enseignant mis à jour');
      }
      
    } catch (error) {
      ToastContairErreur('Une erreur s\'est produite');
      console.log(error);
    }
  }

  return (
    <div className="container-save-ense">
      {/* --- Carte 1 --- */}
      <div className="card-save-ense">
        <h2 className="title-card1">
          <span className="logo-card"><FaPlus /></span>
          Ajouter un cours
        </h2>
        <input type="text" placeholder="Intitulé cours" value={cours} onChange={(e) =>setCours(e.target.value)} className="input-card"/>
        <select value={selectPromotion} onChange={(e) =>setSelectPromotion(e.target.value)} className="input-card">

          <option value="">Sélectionnez Promotion</option>
          {listePromotions!= null && listePromotions.map((element, index)=>(
            <option key={index} value={element.nom_promotion}>
              {element.nom_promotion}
            </option>
          ))}

        </select>

        <select value={ponderation} onChange={(e) =>setPonderation(Number(e.target.value))} className="input-card">
          <option value="0">Sélectionnez Pondération</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <select value={selectEnseignant} onChange={(e)=>setSelectEnseignant(e.target.value)} className="input-card">
          <option value="">Sélectionnez Enseignant</option>
          {listeEnseignants!= null && listeEnseignants.map((element, index)=>(
            <option key={index} value={element.nom}>
              {element.nom}
            </option>
          ))}
        </select>
        
        <input type="text" placeholder="Nom complet enseignant"
         disabled={selectEnseignant !=""} value={nomEnseign} onChange={(e) =>setNomEnseign(e.target.value)} className="input-card"/>
        <input type="text" placeholder="Email enseignant"
          disabled={selectEnseignant !=""} value={email} onChange={(e) =>setEmail(e.target.value)} className="input-card"/>
        <input type="text" placeholder="Téléphone enseignant"
         disabled={selectEnseignant !=""} value={telephone} onChange={(e) =>setTelephone(e.target.value)} className="input-card"/>
        

        <button className="btn add" type="submit" onClick={addSubmit}>Ajouter</button>

      </div>

      {/* --- Carte 2 --- */}
      <div className="card-save-ense">
        <h2 className="title-card2">
          <span className="logo-card"><FaPencil/></span>
          Mise à jour enseignant
        </h2>
        <select value={selectEmail} onChange={(e)=>setSelectEmail(e.target.value)} className="input-card">
          <option value="">Sélectionnez Email</option>
          {listeEmails!= null && listeEmails.map((element, index)=>(
            <option key={index} value={element.email}>
              {element.email}
            </option>
          ))}
        </select>
        <input type="text" placeholder="Nom complet" value={nomModif} onChange={(e) =>setNomModif(e.target.value)} className="input-card"/>
        <input type="text" placeholder="Email" value={emailModif} onChange={(e) =>setEmailModif(e.target.value)} className="input-card"/>
        <input type="text" placeholder="Téléphone" value={telModif} onChange={(e) =>setTelModif(e.target.value)} className="input-card"/>

        <button className="btn edit" type="submit" onClick={updateEnseignByEmail}>Modifier</button>
      </div>

      {/* --- Carte 3 --- */}
      <div className="card-save-ense">
        <h2 className="title-card3">
          <span className="logo-card"><FaTrashCan /></span>
          Suppression 
        </h2>
          <div className="sub-card">
           <h4>Supprimer un enseignant</h4>
           <select className="input-card">
             <option value="">Sélectionnez enseignant</option>
             <option>LUC</option>
             <option>MARK</option>
           </select>

           <button className="btn delete">Supprimer</button>
         </div>

         <div className="sub-card">
           <h4>Supprimer un cours</h4>
           <select className="input-card">
             <option value="">Sélectionnez Cours</option>
             <option>Math</option>
             <option>Histoire</option>
           </select>
           <select className="input-card">
             <option value="">Sélectionnez Promotion</option>
             <option>Licence</option>
             <option>Master</option>
           </select>

           <button className="btn delete">Supprimer</button>
         </div>
      </div>

    </div>
  );
}


