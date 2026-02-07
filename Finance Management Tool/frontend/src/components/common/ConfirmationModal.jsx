export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-bg-surface rounded-xl shadow-xl max-w-sm w-full border border-border-color transform transition-all">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-main mb-2">
                        {title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-6">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-primary transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${isDangerous
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
