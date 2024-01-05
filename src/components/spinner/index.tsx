import React from 'react'
import { ImSpinner2 } from 'react-icons/im'

export default function Spinner() {
  return (
    <div>
      <style>
        {`
            .icon-spin {
              
              -webkit-animation: icon-spin 2s infinite linear;
                      animation: icon-spin 2s infinite linear;
            }
            
            @-webkit-keyframes icon-spin {
              0% {
                -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
              }
              100% {
                -webkit-transform: rotate(359deg);
                        transform: rotate(359deg);
              }
            }
            
            @keyframes icon-spin {
              0% {
                -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
              }
              100% {
                -webkit-transform: rotate(359deg);
                        transform: rotate(359deg);
              }
            }
              `}
      </style>
      <ImSpinner2 className="icon-spin" />
    </div>
  )
}
