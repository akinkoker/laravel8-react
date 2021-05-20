import React from 'react';
import ReactDOM from 'react-dom';

function Toast (p){
    return (
        <div className="toast-container position-absolute p-3 bottom-0 end-0" id="toastPlacement">
            <div className="toast align-items-center bg-secondary text-white" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body flex-grow-1">
                        {p.props.msg}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Toast }