import { useState } from "react";

export function MessengerChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <div className="relative flex items-center">
        <div
          className={`mr-3 rounded-lg bg-brand-navy px-3 py-2 text-sm text-white shadow-soft transition-all duration-300 ${
            open ? "visible opacity-100 translate-x-0" : "invisible opacity-0 translate-x-2"
          }`}
        >
          Пишете ни във Facebook
          <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-brand-navy" />
        </div>
        <a
          href="https://m.me/953887411144700"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Пишете ни във Facebook Messenger"
          className="group relative grid h-14 w-14 place-items-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0084FF] focus:ring-offset-2 md:h-16 md:w-16"
          style={{ backgroundColor: "#0084FF" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:animate-ping" style={{ backgroundColor: "#0084FF" }} />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative h-8 w-8 text-white md:h-9 md:w-9"
            aria-hidden="true"
          >
            <path
              d="M12 2.00098C6.477 2.00098 2 6.19698 2 11.501C2 14.168 3.292 16.558 5.398 18.192V22.001L8.99 19.929C9.868 20.184 10.421 20.278 12 20.278C17.523 20.278 22 16.082 22 10.778C22 5.47598 17.523 2.00098 12 2.00098ZM13.243 13.371L10.596 10.59L5.354 13.657L11.048 7.735L13.695 10.516L18.819 7.512L13.243 13.371Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
