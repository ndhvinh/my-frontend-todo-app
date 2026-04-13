function GlobalApiFeedback({ isLoading, errorMessage, onCloseError }) {
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
          <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-lg px-5 py-4 flex items-center gap-3">
            <span className="global-spinner" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-700 dark:text-dark-text">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-4 right-4 z-[9999] max-w-sm w-[calc(100%-2rem)] animate-[fadeIn_180ms_ease-out]">
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 shadow-lg px-4 py-3 flex items-start gap-3">
            <span className="mt-[2px]">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Có lỗi xảy ra</p>
              <p className="text-sm mt-0.5 break-words">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={onCloseError}
              className="text-red-500 hover:text-red-700 text-sm"
              aria-label="Đóng thông báo lỗi"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalApiFeedback;
