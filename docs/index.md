# Manifesto

GRC Engineering is a step-change evolution in security governance, risk, and compliance (GRC), including tightly related disciplines such as trust and assurance. It’s more than just “GRC + writing code”: it’s a fundamental shift in how GRC is done, harnessing modern engineering tools and approaches, systems thinking and design thinking, and a healthy dose of skepticism to Legacy GRC practices and assumptions.

As a community-led movement, we seek to propel GRC into the modern era so it can

* keep pace with the rapid acceleration in software engineering and security engineering spurred by [Agile](https://agilemanifesto.org/), [DevOps](https://en.m.wikipedia.org/wiki/DevOps), [DevSecOps](https://www.devsecops.org/), [continuous integration](https://en.m.wikipedia.org/wiki/Continuous_integration), [continuous delivery](https://en.m.wikipedia.org/wiki/Continuous_delivery), [continuous deployment](https://en.m.wikipedia.org/wiki/Continuous_deployment), [security guardrails](https://youtu.be/geumLjxtc54?si=MBILJ_qgFDqDqIGD), and [paved roads](https://www.slideshare.net/slideshow/the-paved-road-at-netflix/75867013).
* adapt to an ever-changing landscape of security threats, defensive security practices, and business and technology innovation
* overcome the limitations of "Legacy GRC” practices and programs that typically result in mere checkbox compliance, security theater, and frustrating experiences for organizational stakeholders.

This manifesto defines what we see as the foundational problems with Legacy GRC, what makes GRC Engineering fundamentally different, and how GRC Engineering can lead to far better outcomes that deliver on the promise that GRC was always meant to provide.

## Fundamental problems with Legacy GRC

??? failure "Complacency with manual toil and trivial outputs"

    Settling on manual and often disconnected activities leads to wasted time, error-riddled results, and limited effectiveness of GRC practices. And because manual activities don’t scale, GRC practitioners find themselves settling for low quality outputs and accepting them as “good enough” outcomes. 

    **For example**: the practice of requiring screenshots for producing evidence of control effectiveness (make sure your system clock is visible!) or the practice of periodic look-back analyses (change request reviews, user access reviews, etc.), neither of which scale in ways that allow for demonstrating holistic control effectiveness, timely detection and correction of control deviations or failures, etc.

??? failure "Transactional stakeholder relationships"
    
    Stakeholders and their needs aren’t fully accounted for or appreciated in GRC programs. They are often treated solely as “providers” of GRC activity inputs rather than providers who also consume what GRC provides to them. GRC teams tend to only reach out to stakeholders once a quarter or once a year when it’s time to produce evidence of a control or review and approve a policy. Likewise, GRC tools, processes, data, and experiences are tailored to the needs, desires, and opinions of GRC teams. This creates friction between teams, misinformed thinking within GRC, missed opportunities to create more effective solutions, and frustrating experiences for GRC teams and GRC stakeholders alike.

??? failure "Shallow & narrow problem solving mindset"
    
    Legacy GRC programs treat symptomatic issues in a whack-a-mole fashion without more deeply understanding and addressing root cause problems. This can be due to ignorance of how security risks manifest in the context of relevant threat activity; ignorance of what incentivizes stakeholder behavior; and/or ignorance of how incentive, reporting, and ownership structures exist within the organization. Over time this leads to a growing burden of toilsome and low- or no-value work. 

    **For example**: mandating file integrity monitoring (FIM) without consideration for compensating controls, relevant threat activity, and workload architecture, resulting in lots of noise and increased user friction with little to no security or assurance value added.

??? failure "Excessive focus on closed source frameworks & standards"
    
    Highly static frameworks and industry standards - developed by small, disparate, closed-off, and slow-moving “authority” organizations - are too often seen as an end state to achieve (“we need to be compliant with CIS benchmarks!” or “we’ll use NIST 800-53 as our control set”). The incredible sprawl of disparately-defined yet highly-overlapping frameworks has inevitably led to a growing number of meta-frameworks. This inundation of industry standards has stifled independent and creative thinking among the GRC and InfoSec community writ large, paralyzing our ability to keep pace with a hyperactively evolving problem space. Legacy GRC programs struggle to account for relevant threat, workload, and organizational context when prescribing policies, standards, procedures, and controls. We are encumbered with ineffective and sometimes regressive solutions that fail to mitigate relevant security risk while creating unnecessary friction for stakeholders. 
    
    **For example**: endlessly advocating for the “industry standard” practice of removing users’ local administrator access and implementing deny-by-default application allowlisting to protect against malware, while ignoring the obvious reality that these legacy approaches to endpoint and identity security controls would undermine organizations’ ability to innovate and thus would never be tolerated. This results in missed opportunities to explore alternative controls that are much likelier to be successfully implemented in an organization, such as [decentralized peer reviewed application allowlisting](https://cloud.google.com/blog/topics/developers-practitioners/peer-reviewed-allow-and-deny-software-installation-decisions-enable-scalable-protection) and [self-service just-in-time access (JITA) privilege escalation](https://github.com/SAP/macOS-enterprise-privileges) (here's an example of this for [Windows](https://github.com/pseymour/MakeMeAdmin)).

??? failure "Commoditization of compliance"
    
    While the advent of compliance automation products and low cost audits have boosted GRC’s efficiency, the same cannot be said about the impact they’ve had on GRC’s effectiveness. In other words: automating and streamlining low-value Legacy GRC practices simply results in producing more low-value outcomes, faster. In this context, GRC is largely, if not entirely, valued as a sales enabler or a “cover your ass” necessity rather than as foundational for quickly maturing and sustaining strong security and privacy practices that significantly improve organizational outcomes and customer value.

## GRC Engineering Values

1. **Automate early on and often** over settling for manual processes and workflows
2. **Measurable and meaningful risk outcomes** over commodotized compliance outputs
3. **Evidence, logic, math, and reason** over fear, uncertainty, and doubt
4. **In-depth continuous assurance** over shallow periodic monitoring
5. **Stakeholder-focused solutions** over doing what works best for GRC teams
6. **Shared fate partnerships** over transactional relationships

## GRC Engineering Principles

!!! success inline "Practitioner-led GRC solutions"

    When working together in an open, collaborative, and welcoming community, GRC practitioners, more so than vendors and standards bodies, are in the best position to define and build highly effective solutions to GRC problems. 

!!! success inline "GRC as a product"

    When treated as a product as opposed to a service, GRC provides demonstrably beneficial business, mission, security, and assurance outcomes. (Original text: Instead, we propose the development of GRC products that demonstrably provide clearly defined business and security value outcomes.)

!!! success inline "Threat-informed GRC"

    A clear and current evidence-based understanding of relevant threats is necessary for effective control design and testing as well as risk assessment and management.

!!! success inline "Systems thinking + design thinking"

    [...]

!!! success inline "Build vs. buy pragmatism"

    Original text: Realistic and balanced approach to the build vs. buy debate