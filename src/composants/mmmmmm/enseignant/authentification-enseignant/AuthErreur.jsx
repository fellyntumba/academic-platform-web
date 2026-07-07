import '../../../styles-pages/enseignant/authentification/AuthErreur.css'

export default function AuthErreur({erreur, setShowErreur}) {
  
  return (

      <div className="box-erreur-parent" >
        <div className="box-erreur-fils" onClick={(e)=>e.stopPropagation()}>
          <button className="box-ferme" onClick={setShowErreur}>X</button>   
          <h2 className="box-titre">Notification</h2>
          <span className="box-icon">⚠️</span>
          <p className="box-message">{erreur}</p> 
       
        </div>
       
      </div>
  )
}

