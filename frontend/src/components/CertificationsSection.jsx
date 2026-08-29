import Icon from "./Icon";

export default function CertificationsSection({ certifications }) {
  return (
    <section id="certifications-section" className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
          Certifications
        </h3>
        <div className="h-1 w-12 bg-secondary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-surface-container-low p-6 rounded-sm space-y-4">
            {cert.image && (
              <div className="flex justify-center mb-4">
                <img 
                  src={cert.image} 
                  alt={cert.title}
                  className="max-w-full h-auto rounded-sm"
                />
              </div>
            )}
            
            <h4 className="font-headline text-lg font-bold text-on-surface">
              {cert.title}
            </h4>
            {cert.issuer && (
              <p className="text-on-surface-variant text-sm">{cert.issuer}</p>
            )}
            
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary pt-2 group-hover:gap-4 transition-all self-start"
              >
                View Credential{" "}
                <Icon name="arrow_forward" className="text-sm" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
