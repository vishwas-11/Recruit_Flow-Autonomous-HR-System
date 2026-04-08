export default function StructuredResponse({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-2 text-sm">
      
      {data.name && (
        <p><span className="font-semibold">Name:</span> {data.name}</p>
      )}

      {data.current_company && (
        <p><span className="font-semibold">Company:</span> {data.current_company}</p>
      )}

      {data.skills?.length > 0 && (
        <div>
          <span className="font-semibold">Skills:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-blue-500 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.experience_summary && (
        <p>
          <span className="font-semibold">Experience:</span>{" "}
          {data.experience_summary}
        </p>
      )}

      {data.notable_information && (
        <p>
          <span className="font-semibold">Highlights:</span>{" "}
          {data.notable_information}
        </p>
      )}

      {data.sources?.length > 0 && (
        <div>
          <span className="font-semibold">Sources:</span>
          <ul className="list-disc ml-5">
            {data.sources.map((link, i) => (
              <li key={i}>
                <a
                  href={link}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* onboarding response */}
      {data.employee_id && (
        <div className="bg-green-700 p-2 rounded">
          <p>✅ Employee Created</p>
          <p>ID: {data.employee_id}</p>
          <p>Directory: {data.directory}</p>
        </div>
      )}
    </div>
  );
}