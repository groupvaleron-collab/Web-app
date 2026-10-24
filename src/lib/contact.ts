// Company contact details shown in the customer app.
export const COMPANY_PHONE_DISPLAY = '077 037 6789'
export const WHATSAPP_NUMBER = '94770376789'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export const whatsappWith = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`
