import { useState } from "react";
import { apiFetch } from "../../../jwtAuth";

export default function ProfilePage() {
  const [data, setData] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await apiFetch("/profile");
      const json = await res.json();
      setData(JSON.stringify(json));
    } catch (err) {
      setData(err.message);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <button onClick={fetchProfile}>Get Profile</button>
      <p>{data}</p>
    </div>
  );
}
