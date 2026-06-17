type Msg = { en: string; ar: string };

function hasRepeatedChars(s: string): boolean {
  if (/(.)\1{3,}/.test(s)) return true;
  const clean = s.replace(/\s/g, "").toLowerCase();
  if (clean.length > 5 && new Set(clean).size / clean.length < 0.3) return true;
  return false;
}

export function validateName(value: string): Msg | null {
  const v = value.trim();
  if (!v) return { en: "Full name is required.", ar: "الاسم الكامل مطلوب." };
  if (!/^[؀-ۿa-zA-Z\s]+$/.test(v))
    return {
      en: "Name must contain letters only (no numbers or symbols).",
      ar: "يجب أن يحتوي الاسم على حروف فقط، بدون أرقام أو رموز.",
    };
  const words = v.split(/\s+/).filter(Boolean);
  if (words.length < 2)
    return {
      en: "Please enter your full name (first and last name).",
      ar: "يرجى إدخال الاسم الكامل (الاسم الأول والأخير).",
    };
  if (words.some((w) => hasRepeatedChars(w)))
    return { en: "Please enter a valid full name.", ar: "يرجى إدخال اسم حقيقي." };
  return null;
}

export function validateEmail(value: string): Msg | null {
  const v = value.trim();
  if (!v) return { en: "Email is required.", ar: "البريد الإلكتروني مطلوب." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
    return {
      en: "Please enter a valid email address (e.g. name@domain.com).",
      ar: "يرجى إدخال بريد إلكتروني صحيح (مثال: name@domain.com).",
    };
  return null;
}

export function validatePhone(value: string): Msg | null {
  const v = value.trim();
  if (!v) return null;
  const digits = v.replace(/^\+/, "").replace(/[\s\-()]/g, "");
  if (!/^\d+$/.test(digits) || digits.length < 8 || digits.length > 15)
    return {
      en: "Phone must be 8–15 digits. Use + for country code (e.g. +974XXXXXXXX).",
      ar: "رقم الهاتف يجب أن يكون 8–15 رقمًا. استخدم + لرمز الدولة (مثال: +974XXXXXXXX).",
    };
  return null;
}

export function validateQuantity(value: string): Msg | null {
  const v = value.trim();
  if (!v) return { en: "Quantity is required.", ar: "الكمية مطلوبة." };
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1)
    return {
      en: "Quantity must be a whole number of at least 1.",
      ar: "يجب أن تكون الكمية عددًا صحيحًا 1 على الأقل.",
    };
  if (n > 9999)
    return { en: "Quantity cannot exceed 9,999.", ar: "لا يمكن أن تتجاوز الكمية 9,999." };
  return null;
}

export function validateNotes(value: string): Msg | null {
  const v = value.trim();
  if (!v) return null;
  if (v.length < 5)
    return { en: "Notes must be at least 5 characters.", ar: "يجب أن تحتوي الملاحظات على 5 أحرف على الأقل." };
  if (hasRepeatedChars(v))
    return { en: "Please enter meaningful notes.", ar: "يرجى إدخال ملاحظات ذات معنى." };
  return null;
}

export function validateCompanyName(value: string): Msg | null {
  const v = value.trim();
  if (!v) return { en: "Company name is required.", ar: "اسم الشركة مطلوب." };
  if (v.length < 2)
    return { en: "Please enter a valid company name.", ar: "يرجى إدخال اسم شركة صحيح." };
  if (hasRepeatedChars(v))
    return { en: "Please enter a valid company name.", ar: "يرجى إدخال اسم شركة صحيح." };
  return null;
}

export function validateCity(value: string): Msg | null {
  const v = value.trim();
  if (!v) return { en: "City is required.", ar: "المدينة مطلوبة." };
  if (!/^[؀-ۿa-zA-Z\s]+$/.test(v))
    return {
      en: "City must contain letters only (no numbers or symbols).",
      ar: "يجب أن تحتوي المدينة على حروف فقط، بدون أرقام أو رموز.",
    };
  if (hasRepeatedChars(v))
    return { en: "Please enter a valid city name.", ar: "يرجى إدخال اسم مدينة صحيح." };
  return null;
}

export function validateBusinessType(value: string): Msg | null {
  const v = value.trim();
  if (!v) return { en: "Business type is required.", ar: "نوع النشاط التجاري مطلوب." };
  return null;
}

export function validateMessage(value: string): Msg | null {
  const v = value.trim();
  if (!v) return { en: "Message is required.", ar: "الرسالة مطلوبة." };
  if (v.length < 10)
    return {
      en: "Message must be at least 10 characters.",
      ar: "يجب أن تحتوي الرسالة على 10 أحرف على الأقل.",
    };
  if (hasRepeatedChars(v))
    return { en: "Please enter a meaningful message.", ar: "يرجى إدخال رسالة ذات معنى." };
  return null;
}
