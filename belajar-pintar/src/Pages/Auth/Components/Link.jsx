const Link = ({ href = "#", children, className = "" }) => { return <a href={href} className={`text-blue-500 hover:underline ${className}`}>{children}</a>; };
export default Link;