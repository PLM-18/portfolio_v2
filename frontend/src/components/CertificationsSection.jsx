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
                className="inline-block text-primary hover:text-primary/80 text-sm font-medium underline"
              >
                View Credential →
              </a>
            )}

            {cert.embedCode && (
              <div
                className="mt-4 flex justify-center"
                dangerouslySetInnerHTML={{ __html: cert.embedCode }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
