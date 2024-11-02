const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content bg-white rounded-lg w-full max-w-2xl max-h-[75vh]"
        role="document"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
