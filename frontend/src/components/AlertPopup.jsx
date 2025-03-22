// frontend/src/components/AlertPopup.jsx
import React, { useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext.jsx';

function AlertPopup() {
  const { alerts, clearAlert } = useContext(AlertContext);

  if (!alerts.length) return null;

  return (
    <div className="alert-popup">
      {alerts.map((alert, index) => (
        <div key={index} className="alert">
          <p>{alert.message}</p>
          <button onClick={() => clearAlert(index)}>Close</button>
        </div>
      ))}
    </div>
  );
}

export default AlertPopup;