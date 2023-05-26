// These headers appear in the request, but are not passed upstream
const UNSIGNABLE_HEADERS = ["x-forwarded-proto", "x-real-ip"];

// Filter out cf-* and any other headers we don't want to include in the signature
// Certain headers, such as x-real-ip, appear in the incoming request but
// are removed from the outgoing request. If they are in the outgoing
// signed headers, B2 can't validate the signature.
export function filterHeaders(headers: Headers) {
  return Array.from(headers.entries()).filter(
    (pair) =>
      !UNSIGNABLE_HEADERS.includes(pair[0]) && !pair[0].startsWith("cf-")
  );
}
