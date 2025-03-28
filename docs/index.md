# Manifesto

GRC Engineering is a step-change evolution in security governance, risk, and compliance (GRC), and related disciplines such as trust and assurance. It’s more than just “GRC + writing code.”  It’s a fundamental shift in how GRC is done, one that fully embraces an engineering mindset (broadly speaking), [systems thinking](https://en.m.wikipedia.org/wiki/Systems_thinking) and [design thinking](https://en.m.wikipedia.org/wiki/Design_thinking), and a customer-centric focus around how best to deliver GRC outcomes.

We see the [organic interest](https://www.reddit.com/r/cybersecurity/comments/18efir2/grc_engineering/) and momentum that is growing around GRC Engineering as an opportunity to bring our community together with a shared definition of what GRC Engineering is as well as a shared focus on advancing it together before it’s co-opted and constrained by commercial interests.

As a group of impassioned GRC practitioners, we seek to propel GRC into the modern era so it can: 

* keep pace with the rapid acceleration in software engineering and security engineering spurred by [Agile](https://agilemanifesto.org/), [DevOps](https://en.m.wikipedia.org/wiki/DevOps), [DevSecOps](https://www.devsecops.org/), [continuous integration](https://en.m.wikipedia.org/wiki/Continuous_integration), [continuous delivery](https://en.m.wikipedia.org/wiki/Continuous_delivery), [continuous deployment](https://en.m.wikipedia.org/wiki/Continuous_deployment), [security guardrails](https://youtu.be/geumLjxtc54?si=MBILJ_qgFDqDqIGD), and [paved roads](https://www.slideshare.net/slideshow/the-paved-road-at-netflix/75867013).
* adapt to an ever-changing landscape of security threats, defensive security practices, and business and technology innovation
* overcome the limitations of Legacy GRC that typically result in mere checkbox compliance, security theater, and frustrating experiences for stakeholders

This manifesto defines what we see as the foundational problems with Legacy GRC, what makes GRC Engineering fundamentally different, and how GRC Engineering can lead to far better outcomes that deliver on the promise that GRC was always meant to provide.

## Fundamental problems with Legacy GRC

??? warning "Complacency with manual toil and trivial outputs"

    Settling on manual and disconnected GRC activities leads to wasted time, erroneous results, and limited effectiveness. Because manual activities don’t scale, GRC practitioners find themselves settling for low quality outputs, toiling away at producing mediocre outcomes that only affect or pertain to small fragments of an organization’s security and privacy programs.

    **For example**: the practice of requiring screenshots for producing evidence of control effectiveness (“make sure your system clock is visible!”) or the practice of periodic look-back analyses (change management reviews, user access reviews, etc.), neither of which scale in ways that allow for demonstrating holistic control effectiveness, timely detection and correction of control deviations or failures, etc.

??? warning "Transactional GRC-centric stakeholder relationships"
    
    Stakeholders and their needs aren’t fully accounted for or appreciated in GRC programs. They are often treated solely as “providers” of GRC activity inputs rather than consumers of what GRC provides to them. GRC teams tend to only reach out to stakeholders once a quarter or once a year when it’s time to produce evidence of a control or review and approve a policy. A mindset of “what do I need from this stakeholder and when do I need it” prevails over a more customer-centric one of “how can I make it as easy as possible for this stakeholder to uphold their responsibilities and achieve their goals in the context of GRC?”

    Likewise, GRC tools, processes, data, and experiences are tailored to the needs, desires, and opinions of GRC teams. This creates friction between teams, misinformed thinking within GRC, missed opportunities to create more effective solutions, and frustrating experiences for GRC teams and GRC stakeholders alike.

    **For example**: purpose-built risk register web applications that provide a UI and UX that are barely tolerable for GRC practitioners and that are beyond intolerable for software developers, IT admins, executives, and other organizational stakeholders. Rather than being able to collaborate with cross-functional stakeholders within their risk register, GRC practitioners are forced to live in their siloed tool, integrate with a separate work management tool (e.g. Jira, Asana, Monday, etc.), and sync items as needed for stakeholders to consume. This results in avoidable waste. 

??? warning "Shallow & narrow problem solving mindset"
    
    Legacy GRC programs treat symptomatic issues in a whack-a-mole fashion without more deeply understanding and addressing root cause problems. This can be due to ignorance of how security risks manifest in the context of plausible threat activity; ignorance of what incentivizes stakeholder behavior; and/or ignorance of how reporting and ownership structures within an organization drive resource allocation and work execution. This leads to inefficient collaboration, continuous confusion between GRC teams and their stakeholders, and a lagging GRC goal achievement.

    **For example**: mandating file integrity monitoring (FIM) as a must-have compliance requirement without consideration for alternative controls, relevant threat models, and workload architecture, resulting in lots of noise and increased user friction with little to no security assurance value added. Additionally, struggling to get GRC work prioritized by solely working directly with individual contributors or team managers, overlooking how senior leadership and/or other teams (e.g. Product Management) play a bigger role in work prioritization decisions. 

??? warning "Excessive focus on closed source frameworks & standards"
    
    Highly static frameworks and industry standards – typically developed by small, disparate, closed-off, and slow-moving “authority” organizations – are too often seen as an end state to achieve (“we need to be compliant with CIS benchmarks!” or “we’ll use NIST 800-53 as our control set…because!”). The incredible sprawl of disparate-yet-overlapping frameworks has inevitably led to a growing number of meta-frameworks. This inundation of industry standards has stifled independent and creative thinking among the GRC and InfoSec community, paralyzing our ability to keep pace with a constantly evolving problem space. 

    Legacy GRC programs struggle to account for relevant threat models, workload designs, and organizational context when prescribing policies, standards, procedures, and controls. We are encumbered with ineffective and sometimes regressive solutions that fail to mitigate plausible and probable risks while creating unnecessary friction for stakeholders. 
    
    **For example**: endlessly advocating for the “industry standard” practice of removing users’ local administrator access and implementing deny-by-default application allowlisting to protect against malware, while ignoring the obvious reality that these legacy approaches to endpoint and identity security controls would undermine organizations’ ability to innovate and thus would never be tolerated. This results in missed opportunities to explore alternative controls that are much likelier to be successfully implemented in an organization, such as [decentralized peer reviewed application allowlisting](https://cloud.google.com/blog/topics/developers-practitioners/peer-reviewed-allow-and-deny-software-installation-decisions-enable-scalable-protection) and [self-service just-in-time access (JITA) privilege escalation](https://github.com/SAP/macOS-enterprise-privileges) (here's an example of this for [Windows](https://github.com/pseymour/MakeMeAdmin)).

??? warning "Commoditization of compliance"
    
    While the advent of compliance automation products and low-cost audits have boosted GRC’s efficiency, the same cannot be said about the impact they’ve had on GRC’s effectiveness. In other words: automating and streamlining Legacy GRC practices simply results in producing low-value outcomes faster. In this context, GRC is largely, if not entirely, valued as a sales enabler or a “cover-your-ass” necessity rather than as foundational for having strong security and privacy practices that sustainably improve organizational outcomes and customer value.

    **For example**: SOC 2 Type II audits are notorious for being inherently open ended “tests” of an organization's controls. In cases where a low cost audit provider is used, it can be akin to a student writing both the questions and answer key for an exam, providing that to the teacher, and the teacher grading their answers accordingly. Organizations have long been incentivized to pass their audits with no findings so as to not disrupt sales. Audit providers have been incentivized to be “flexible” to ensure their customers are happily provided a passing audit and keep giving them their business. Vendor due diligence teams are pressured to approve vendors and accept industry standard audit results without much, if any, additional scrutiny, treating it as a “rigorous” examination of an organization’s controls. New GRC automation products merely speed up this perversely incentivized cycle without creating stronger incentives to improve controls beyond checkbox compliance.

## Values
_A value is something that has relative worth, merit, or importance. That is, while there is value in the items on the right, we value the items on the left more._

1. **Automate early on and often** over settling for manual processes and workflows
2. **GRC-as-Code** over tool-specific constructs
3. **Measurable and meaningful risk outcomes** over checkbox compliance outputs
4. **Evidence, logic, math, and reason** over fear, uncertainty, and doubt
5. **In-depth continuous assurance** over shallow periodic monitoring
6. **Stakeholder-centric UX** over building what works best for GRC teams
7. **Shared fate partnerships** over transactional relationships
8. **Open source practitioner-developed solutions** over closed source vendor and industry organization paradigms


## Principles
_A principle describes a fundamental truth of GRC Engineering that enables efficient, effective, and delightful GRC outcomes and experiences._

??? success "Shift, and start, GRC left"

    By embedding GRC practices during the initial stages of system or process development, all stakeholders (including GRC, Eng, Infra) can proactively avoid potential risks, be compliant-by-default, and start with well-governed processes and implementations that scale smoothly over time.

??? success "Practitioners can build better solutions"

    When working together in an open, collaborative, and welcoming community, GRC practitioners – more so than vendors, government agencies, and industry organizations – are in a prime position to define and build the best solutions to the problems they face on a regular basis. Building *and* using solutions for your own problems creates an immediate feedback loop that allows for faster and more intelligent iteration around feature development, UI/UX enhancements, and defect resolution. We have seen this be the case with best-in-class open source security solutions that have been developed by practitioners across other security domains over the years: [Metasploit](https://github.com/rapid7/metasploit-framework) for offensive security, [osquery](https://github.com/osquery/osquery) for endpoint security, [Trufflehog](https://github.com/trufflesecurity/trufflehog) for credential security, [Velociraptor](https://github.com/Velocidex/velociraptor) for threat hunting, etc. We can and should do the same for GRC tools, concepts, and frameworks.

??? success "GRC as a product"

    When treated as a product as opposed to a service, GRC provides demonstrably beneficial business, mission, security, and assurance outcomes - beyond GRC’s primary use cases. For example: data collected through continuous control monitoring could be used by partner teams to solve other tangentially-related problems; user access review data helping system owners proactively maintain better security hygiene beyond what is expected from a compliance programs. 

??? success "Threat-informed GRC"

    A clear and current evidence-based understanding of relevant threats and threat activity is necessary for consistently sustaining highly effective controls, risk management, and governance.

??? success "Systems thinking + design thinking"

    Before trying to solve problems, it's essential to clearly identify the underlying root causes of them, understand how those root causes manifest symptomatically, and what people’s experiences are when dealing with them. [Systems thinking](https://en.m.wikipedia.org/wiki/Systems_thinking) allows us to more effectively do this by understanding problems in a more holistic context of an overarching system, i.e. things that interact and interrelate in ways that produce patterns of behaviors. Systems thinking can substantially augment GRC activities such as risk identification, analysis, and assessment; control design, monitoring, and testing; governance and process engineering; etc. 

    When combined with systems thinking, [design thinking](https://en.m.wikipedia.org/wiki/Design_thinking) allows us to ideate and implement highly effective solutions in ways that

    - empathetically account for stakeholders’ experiences and needs
    - embrace participatory approaches to solution development; and 
    - emphasize rapid prototyping and frequent solution iteration to incrementally deliver value to stakeholders, early on and often

    Synthesizing these two thinking styles can unlock new levels of efficiency and effectiveness for any GRC program.

## Authors
- [Ayoub Fandi](https://www.linkedin.com/in/ayoubfandi/)
- [Akshay Finney](https://www.linkedin.com/in/akshay-finney/)
- [Austin Rust](https://www.linkedin.com/in/austin-rust-1a5b2b3b/)
- [Charles Nwatu](https://www.linkedin.com/in/cnwatu/)
- [Emre Ugurlu](https://www.linkedin.com/in/emre-ugurlu-48596b116/)
- [Justin Pagano](https://www.linkedin.com/in/justinpagano/)
- [Terra Cooke](https://www.linkedin.com/in/terra-cooke-24552918/)
- [Varun Gurnaney](https://www.linkedin.com/in/varungurnaney/)
- [Yash Devadiga](https://www.linkedin.com/in/yash-devadiga-2b2992241/)

## GRC Engineering Resources
- [GRC Engineering Podcast](https://open.spotify.com/show/3SkXwuXewy0qXXhICy5e6W)
- [The GRC Engineer Newsletter](https://grcengineer.com)
- [Awesome Security GRC List](https://github.com/Arudjreis/awesome-security-GRC)
- [Varun Gurnaney’s Medium](https://medium.com/@varungurnaney)

## Get Involved!
[Join our Discord :fontawesome-brands-discord:](https://discord.gg/YDrcFK7t){ .md-button .md-button--primary }
[Join our LinkedIn Group :fontawesome-brands-linkedin:](https://www.linkedin.com/groups/12997229/){ .md-button }
[Contribute on GitHub :fontawesome-brands-square-github:](https://github.com/grcengineering){ .md-button }