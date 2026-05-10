const b = { h1: "text-4xl font-bold", h2: "text-3xl font-semibold", h3: "text-2xl font-semibold" };
const Heading = ({ as = "h2", children, className = "", color = "text-gray-800", spacing = "mb-4" }) => { const Tag = as; return <Tag className={`${b[as]} ${color} ${spacing} ${className}`}>{children}</Tag>; };
export default Heading;