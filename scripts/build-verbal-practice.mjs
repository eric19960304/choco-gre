import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  additionalRcPassages,
  additionalSentenceEquivalence,
  additionalTcDouble,
  additionalTcSingle,
  additionalTcTriple,
} from './verbal-practice-expansion.mjs'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const choiceIds = ['A', 'B', 'C', 'D', 'E', 'F']
const makeChoices = (items) => items.map((text, index) => ({ id: choiceIds[index], text }))

const rcPassages = [
  {
    id: 'rc-p01',
    title: 'Urban heat and tree cover',
    text: 'Urban greening studies often report a single average temperature reduction for an entire city. Yet a dense network of street-level sensors has revealed that the effect of trees varies sharply by hour and location. Shade can substantially cool exposed sidewalks during the afternoon, while a continuous canopy may slow the release of heat from some streets after sunset. These findings do not weaken the case for planting trees: they show that species, spacing, and the daily rhythms of pedestrian use matter. A plan designed only to maximize canopy percentage may therefore miss opportunities to place cooling where and when residents need it most.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'Which choice best states the main idea of the passage?',
        choices: [
          'Urban tree planting should be abandoned because trees can retain heat after sunset.',
          'Street-level sensors are too inconsistent to guide urban planning.',
          'Tree-planting plans should account for variation in cooling across time and place.',
          'Cities should plant only those tree species that produce the densest canopy.',
          'Pedestrian behavior has a greater effect on urban heat than vegetation does.',
        ],
        answer: [2],
        explanation: 'The passage supports urban greening but argues that planners should consider when and where cooling occurs, not canopy percentage alone.',
        skills: ['main idea', 'argument structure'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which statements are supported by the passage? Select all that apply.',
        choices: [
          'A citywide average can conceal meaningful local differences in cooling.',
          'Dense tree canopies invariably reduce nighttime temperatures.',
          'The timing of pedestrian activity can be relevant to tree placement.',
        ],
        answer: [0, 2],
        explanation: 'The sensor findings show that averages conceal hourly and local variation, and the author explicitly connects planning to pedestrian-use rhythms. Dense canopy can sometimes slow nighttime heat release, so the second statement is not supported.',
        skills: ['detail', 'multiple evidence'],
      },
    ],
  },
  {
    id: 'rc-p02',
    title: 'Silence in historical archives',
    text: 'A generation of historians treated the near absence of tenant protests from municipal archives as evidence that such protests were rare. More recent researchers note, however, that those archives were assembled by officials whose principal concern was orderly tax collection, not the preservation of dissent. Neighborhood newsletters and oral histories describe rent strikes that official reports mention only obliquely, if at all. These alternative sources are not free of distortion, but they expose a methodological error: archival silence may reveal the priorities of record keepers rather than the inactivity of people who left few official documents.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The author mentions neighborhood newsletters and oral histories primarily to',
        choices: [
          'prove that municipal officials deliberately destroyed records',
          'provide evidence that complicates an inference drawn from official archives',
          'show that unofficial sources are always more accurate than official ones',
          'explain why tax collection became disorderly',
          'argue that rent strikes were the dominant form of tenant protest',
        ],
        answer: [1],
        explanation: 'The alternative sources document protests omitted from official archives, undermining the inference that archival silence meant protests were rare.',
        skills: ['function', 'evidence'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'The passage suggests which of the following? Select all that apply.',
        choices: [
          'The purposes of record keepers can shape what survives in an archive.',
          'The absence of an event from official records proves that the event was unimportant.',
          'Oral histories eliminate the problem of source distortion.',
        ],
        answer: [0],
        explanation: 'Only the first statement follows. The passage rejects treating absence as proof and explicitly says alternative sources are not free of distortion.',
        skills: ['inference', 'source evaluation'],
      },
    ],
  },
  {
    id: 'rc-p03',
    title: 'Rethinking invasive species',
    text: 'The label “invasive” is often used as though a species’ foreign origin were sufficient to predict ecological harm. A broad synthesis of island ecosystems complicates that assumption. Some introduced plants increase local species counts by occupying disturbed ground, even while others displace rare endemic plants. Moreover, an introduction that appears benign over a decade may alter fire regimes over a century. The synthesis does not recommend indifference toward introduced species. Rather, it urges managers to specify the effect, spatial scale, and time horizon that justify intervention instead of allowing geographic origin to stand in for ecological analysis.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The author’s primary purpose is to',
        choices: [
          'argue that introduced species are generally beneficial',
          'deny that introduced species can threaten endemic plants',
          'advocate evaluating introduced species by their effects and context',
          'show that island ecosystems recover rapidly from disturbance',
          'replace ecological management with historical analysis',
        ],
        answer: [2],
        explanation: 'The passage calls for effect-, scale-, and time-specific analysis rather than using foreign origin alone as a proxy for harm.',
        skills: ['main idea', 'qualification'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which claims are consistent with the synthesis described? Select all that apply.',
        choices: [
          'All introduced plants that increase local species counts are harmless.',
          'A management decision may depend on the spatial and temporal scale considered.',
          'A category based on origin can obscure variation in ecological effects.',
        ],
        answer: [1, 2],
        explanation: 'The synthesis emphasizes scale and warns that origin alone obscures effects. It does not say that increased local richness guarantees harmlessness.',
        skills: ['inference', 'scope'],
      },
    ],
  },
  {
    id: 'rc-p04',
    title: 'Measuring productivity',
    text: 'Economists debating the recent productivity slowdown sometimes blame measurement. Many digital services are free to users, so improvements in their quality may raise welfare without appearing fully in gross domestic product. This omission is real, but it cannot carry the entire argument. Measured productivity has also slowed in sectors whose outputs—tons of steel or hours of freight transport—are less elusive. Better measures might narrow the apparent slowdown, yet the persistence of weak growth in readily measured industries suggests that explanation must also address investment, management, and the diffusion of new technology.',
    questions: [
      {
        difficulty: 'hard',
        format: 'single',
        stem: 'Which choice best describes the author’s position?',
        choices: [
          'Measurement problems completely explain the productivity slowdown.',
          'Digital services should be excluded from economic analysis.',
          'The productivity slowdown is entirely the result of weak management.',
          'Measurement contributes to the apparent slowdown but is not a sufficient explanation.',
          'Outputs in physical industries are impossible to measure reliably.',
        ],
        answer: [3],
        explanation: 'The author accepts that free digital services create omissions but argues that slow growth in measurable sectors requires additional explanations.',
        skills: ['author position', 'qualification'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'According to the passage, which statements are true? Select all that apply.',
        choices: [
          'Free digital services create a challenge for conventional output measures.',
          'Every instance of weak productivity growth is a statistical illusion.',
          'Evidence from physical industries is relevant to evaluating the measurement explanation.',
        ],
        answer: [0, 2],
        explanation: 'The passage supports the first and third statements. It explicitly denies that measurement alone explains every part of the slowdown.',
        skills: ['detail', 'argument evaluation'],
      },
    ],
  },
  {
    id: 'rc-p05',
    title: 'Unreliable narrators',
    text: 'Criticism of unreliable narrators often treats a novel as a puzzle whose solution is the set of facts the narrator has distorted. That approach can be useful, but it is incomplete. In many novels, the narrator’s evasions force readers to notice the standards by which they themselves judge credibility. A narrator may report every event accurately yet arrange those events to excuse cruelty or invite contempt. Reliability, then, is not only a question of factual correspondence; it can also concern the ethical frame through which facts acquire significance.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The passage challenges the view that',
        choices: [
          'readers make ethical judgments about fictional characters',
          'all narrators distort the events they describe',
          'narrative reliability is solely a matter of factual accuracy',
          'novels can be analyzed as carefully constructed puzzles',
          'the sequence of reported events affects a narrative',
        ],
        answer: [2],
        explanation: 'The author argues that reliability can involve ethical framing even when reported facts are accurate.',
        skills: ['central claim', 'contrast'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which ideas are supported by the passage? Select all that apply.',
        choices: [
          'Every discrepancy in a narrative has a single factual solution.',
          'A narrator’s arrangement of facts can influence a reader’s moral response.',
          'Ethical framing matters only when the narrator states false facts.',
        ],
        answer: [1],
        explanation: 'Only the second statement is supported. The passage rejects a purely factual puzzle model and gives ethical framing independent importance.',
        skills: ['inference', 'rhetorical analysis'],
      },
    ],
  },
  {
    id: 'rc-p06',
    title: 'Atmospheres of distant planets',
    text: 'Oxygen in an exoplanet’s atmosphere is frequently described as a biosignature, but oxygen need not be biological. Ultraviolet radiation can split water molecules, allowing light hydrogen to escape while oxygen accumulates. Conversely, life may exist on a planet whose atmosphere contains little free oxygen. Researchers therefore increasingly seek combinations of gases that are difficult to sustain together without continuous replenishment, while also modeling the host star and planetary geology. The objective is not to find a single decisive molecule but to construct a contextual case in which competing nonbiological explanations become progressively less plausible.',
    questions: [
      {
        difficulty: 'hard',
        format: 'single',
        stem: 'The passage indicates that researchers increasingly favor',
        choices: [
          'treating any oxygen detection as proof of life',
          'ignoring planetary geology when analyzing atmospheres',
          'searching only for planets with little free oxygen',
          'evaluating multiple atmospheric and planetary signals together',
          'assuming ultraviolet radiation is always biological in origin',
        ],
        answer: [3],
        explanation: 'The passage advocates a contextual case based on gas combinations, the host star, and geology rather than a single molecule.',
        skills: ['main idea', 'scientific reasoning'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements follow from the passage? Select all that apply.',
        choices: [
          'Atmospheric oxygen is sufficient by itself to establish the presence of life.',
          'The properties of a planet’s host star can matter when interpreting its atmosphere.',
          'Certain combinations of gases may provide stronger evidence than one gas alone.',
        ],
        answer: [1, 2],
        explanation: 'The author rejects oxygen as decisive and explicitly includes the host star and gas combinations in a contextual assessment.',
        skills: ['inference', 'evidence synthesis'],
      },
    ],
  },
  {
    id: 'rc-p07',
    title: 'The cost of animal signals',
    text: 'Early models of animal communication proposed that reliable signals must be costly: only a strong animal, for example, could afford an extravagant display. Cost can indeed stabilize honesty, but it is not the only mechanism. Some signals are constrained by anatomy, so their form directly reflects the quality they advertise. In other cases, senders and receivers share enough interests that deception offers little advantage. Thus, asking whether a signal is expensive may be less informative than asking what prevents a dishonest signaler from benefiting.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The author would most likely agree that signal honesty',
        choices: [
          'always requires a large energetic expense',
          'can be maintained by mechanisms other than cost',
          'occurs only when senders and receivers are genetically identical',
          'cannot be explained by anatomical constraints',
          'is impossible when deception offers any advantage',
        ],
        answer: [1],
        explanation: 'The passage names anatomical constraints and aligned interests as alternatives to high cost.',
        skills: ['main idea', 'generalization'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements are supported? Select all that apply.',
        choices: [
          'Only costly signals can convey reliable information.',
          'Shared interests can reduce the benefit of deception.',
          'A low-cost signal is necessarily deceptive.',
        ],
        answer: [1],
        explanation: 'The passage explicitly says shared interests can make deception unprofitable and rejects cost as a necessary condition.',
        skills: ['detail', 'logical implication'],
      },
    ],
  },
  {
    id: 'rc-p08',
    title: 'Precedent and legal change',
    text: 'The doctrine of precedent promises consistency by asking courts to follow earlier decisions. Yet legal systems that prize precedent also recognize exceptions: a rule may be distinguished, narrowed, or overturned. Critics see this flexibility as evidence that precedent merely disguises judicial preference. Defenders reply that the alternatives are not unlimited; judges must explain how a new decision relates to an inherited body of law, and those explanations can be challenged. On this view, precedent is neither a mechanical command nor an empty ritual, but a structured practice for negotiating stability and change.',
    questions: [
      {
        difficulty: 'hard',
        format: 'single',
        stem: 'The passage presents the defenders of precedent as maintaining that',
        choices: [
          'earlier decisions should never be overturned',
          'judges are unconstrained whenever they distinguish a case',
          'reason-giving limits how legal rules can be changed',
          'consistency is less important than judicial preference',
          'precedent operates as a fully mechanical command',
        ],
        answer: [2],
        explanation: 'Defenders argue that judges must relate decisions to inherited law and can be challenged, making flexibility structured rather than unlimited.',
        skills: ['viewpoint', 'argument structure'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which claims does the passage attribute to either critics or defenders? Select all that apply.',
        choices: [
          'Precedent determines legal outcomes without interpretation.',
          'Flexibility can be understood as part of a practice balancing stability and change.',
          'The available ways to revise precedent may be less constrained than defenders claim.',
        ],
        answer: [1, 2],
        explanation: 'The author’s synthesis supports the second statement, while critics’ charge that precedent disguises preference supports the third. No side says precedent is purely mechanical.',
        skills: ['multiple viewpoints', 'inference'],
      },
    ],
  },
  {
    id: 'rc-p09',
    title: 'Pottery and ancient trade',
    text: 'Archaeologists have often used the chemical composition of pottery to identify the clay source and infer trade routes. Experimental firing, however, shows that extreme temperatures can alter some chemical signatures. In addition, clay deposits separated by considerable distance may resemble one another. These complications do not make compositional analysis useless. They do mean that a trade claim is stronger when chemical evidence converges with vessel style, workshop debris, and the archaeological context in which the pottery was found.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The passage primarily argues that compositional analysis',
        choices: [
          'should replace stylistic analysis of pottery',
          'cannot provide any evidence about ancient trade',
          'is reliable only for pottery fired at extreme temperatures',
          'is most persuasive when combined with other evidence',
          'proves that distant clay deposits are chemically distinct',
        ],
        answer: [3],
        explanation: 'The author retains compositional analysis but says trade claims become stronger when several kinds of evidence converge.',
        skills: ['main idea', 'methodology'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements are supported by the passage? Select all that apply.',
        choices: [
          'Chemical similarity alone may not uniquely identify a clay source.',
          'Firing never changes the chemical properties used in analysis.',
          'Workshop debris can strengthen an inference about pottery production or trade.',
        ],
        answer: [0, 2],
        explanation: 'Similar distant deposits make chemistry non-unique, and workshop debris is listed as corroborating evidence. Experimental firing can alter signatures.',
        skills: ['detail', 'evidence'],
      },
    ],
  },
  {
    id: 'rc-p10',
    title: 'Choice in the age of streaming',
    text: 'Digital music services offer listeners catalogs of unprecedented size, a development often equated with greater cultural diversity. Access, however, is not the same as attention. Recommendation systems reduce search costs partly by directing users toward recordings similar to those they already play. As a result, the range of music technically available can expand while the range actually heard by a typical listener contracts. This outcome is not inevitable: interfaces that foreground unfamiliar genres or explain why a surprising selection was recommended can encourage exploration. Catalog size therefore measures opportunity, not realized diversity.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'Which choice best expresses the passage’s central distinction?',
        choices: [
          'Recorded music versus live performance',
          'The availability of diverse music versus attention to diverse music',
          'Popular genres versus technically sophisticated genres',
          'Human recommendations versus inaccurate algorithms',
          'Free services versus paid subscriptions',
        ],
        answer: [1],
        explanation: 'The passage repeatedly contrasts a large available catalog with the narrower range listeners may actually hear.',
        skills: ['main idea', 'conceptual distinction'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements are consistent with the passage? Select all that apply.',
        choices: [
          'Increasing catalog size necessarily diversifies each listener’s habits.',
          'A service can expand available choices while concentrating actual listening.',
          'Interface design can influence whether users explore unfamiliar music.',
        ],
        answer: [1, 2],
        explanation: 'The passage separates access from attention and says interface choices can encourage exploration; greater catalog size does not guarantee diverse listening.',
        skills: ['inference', 'application'],
      },
    ],
  },
  {
    id: 'rc-p11',
    title: 'Reading tree rings',
    text: 'Tree-ring width is widely used to reconstruct past rainfall, since trees often grow more in wet years. But growth also responds to temperature, carbon dioxide, competition, and pests. A narrow ring is therefore not a simple synonym for drought. Researchers improve reconstructions by calibrating modern trees against instrumental records, selecting sites where moisture is the dominant constraint, and comparing rings with lake sediments or historical documents. The resulting record remains an inference, but a disciplined one whose uncertainty can be estimated rather than ignored.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The passage emphasizes that tree-ring reconstructions',
        choices: [
          'are useless because too many factors affect trees',
          'directly record rainfall without interpretation',
          'become more credible through calibration and corroboration',
          'should rely exclusively on the oldest available trees',
          'cannot include estimates of uncertainty',
        ],
        answer: [2],
        explanation: 'The author describes site selection, modern calibration, and comparison with other evidence as ways to discipline the inference.',
        skills: ['main idea', 'scientific method'],
      },
      {
        difficulty: 'easy',
        format: 'multiple',
        stem: 'Which statements are supported? Select all that apply.',
        choices: [
          'Every narrow tree ring indicates a drought year.',
          'Researchers can use other records to evaluate a tree-ring reconstruction.',
          'Because reconstructions involve inference, they have no scientific value.',
        ],
        answer: [1],
        explanation: 'Only the second statement follows. The passage denies a one-to-one relation between narrow rings and drought and treats disciplined inference as valuable.',
        skills: ['detail', 'scope'],
      },
    ],
  },
  {
    id: 'rc-p12',
    title: 'Remote work and innovation',
    text: 'Studies of remote work often focus on individual productivity, which can remain stable or even improve outside the office. Innovation, however, is not simply the sum of completed individual tasks. Some firms report fewer exchanges between employees in distant departments after adopting fully remote schedules, suggesting that weak social ties—casual contacts beyond one’s immediate team—may carry useful information. Other firms have restored such exchange through rotating project groups and deliberate cross-team forums. The evidence favors neither universal return-to-office mandates nor effortless remote optimism; work design should reflect the kinds of coordination a task requires.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The author’s conclusion is that organizations should',
        choices: [
          'evaluate work arrangements according to the coordination demands of tasks',
          'assume that individual productivity guarantees innovation',
          'eliminate all fully remote schedules',
          'preserve weak ties only through informal office contact',
          'measure employee output without considering information exchange',
        ],
        answer: [0],
        explanation: 'The final sentence explicitly recommends matching work design to task-specific coordination needs.',
        skills: ['conclusion', 'synthesis'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which claims are supported by the passage? Select all that apply.',
        choices: [
          'One work-location policy is optimal for every kind of task.',
          'Deliberate organizational practices can partly restore cross-team exchange.',
          'Stable individual productivity settles the question of innovative performance.',
        ],
        answer: [1],
        explanation: 'Rotating groups and cross-team forums can restore exchange. The author rejects universal policies and distinguishes individual productivity from innovation.',
        skills: ['inference', 'contrast'],
      },
    ],
  },
  {
    id: 'rc-p13',
    title: 'Measuring language revival',
    text: 'Language revitalization programs are often judged by the number of people who can pass a proficiency test. That measure is useful but incomplete. A school program may produce many capable second-language speakers without increasing the use of the language between parents and children. Conversely, a small community may expand the language into local government, commerce, and digital media before speaker counts rise substantially. Durable revival depends not only on competence but also on the social domains in which speakers expect the language to be understood and valued.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The passage’s main point is that language revival should be assessed by',
        choices: [
          'proficiency test results alone',
          'the number of schools that offer any language course',
          'both speaker competence and the domains in which the language is used',
          'whether the language replaces all other languages in commerce',
          'digital media use rather than family transmission',
        ],
        answer: [2],
        explanation: 'The author calls proficiency useful but incomplete and adds intergenerational and institutional domains of use.',
        skills: ['main idea', 'evaluation criteria'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements follow from the passage? Select all that apply.',
        choices: [
          'A rising proficiency count is sufficient evidence of durable revival.',
          'School instruction cannot contribute to language revitalization.',
          'Where a language is socially usable affects its prospects for revival.',
        ],
        answer: [2],
        explanation: 'The passage treats schools and tests as useful but insufficient. Its central additional factor is the range of social domains where use is expected and valued.',
        skills: ['inference', 'qualification'],
      },
    ],
  },
  {
    id: 'rc-p14',
    title: 'What thought experiments can do',
    text: 'Philosophical thought experiments are sometimes criticized because readers disagree about the intuitions they elicit. If a scenario produces no uniform verdict, critics ask, how can it establish a conclusion? This objection assumes that a thought experiment’s only function is to collect votes for an intuition. Yet an imagined case can expose an unnoticed ambiguity, separate principles that usually travel together, or generate hypotheses for empirical study. Disagreement may itself be informative when it reveals that a supposedly universal concept varies with context. Thought experiments need not function as miniature proofs to be intellectually productive.',
    questions: [
      {
        difficulty: 'hard',
        format: 'single',
        stem: 'The author responds to critics by arguing that thought experiments',
        choices: [
          'always produce universal intuitions',
          'can be valuable even when they do not establish a decisive verdict',
          'should replace empirical investigation',
          'are useful only when readers agree',
          'eliminate ambiguity from every philosophical concept',
        ],
        answer: [1],
        explanation: 'The author broadens their function: they can reveal ambiguities, separate principles, and generate hypotheses without acting as proofs.',
        skills: ['argument response', 'main idea'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which statements are supported by the passage? Select all that apply.',
        choices: [
          'The author regards every intuitive disagreement as a failure.',
          'Variation in responses can reveal contextual features of a concept.',
          'A thought experiment must prove a conclusion to be productive.',
        ],
        answer: [1],
        explanation: 'The author specifically identifies disagreement as potentially informative and rejects proof as the only measure of productivity.',
        skills: ['inference', 'author stance'],
      },
    ],
  },
  {
    id: 'rc-p15',
    title: 'Restoring paintings',
    text: 'Cleaning a painting may uncover colors obscured by soot and discolored varnish, but it can also remove a patina through which generations encountered the work. Restorers therefore face more than a technical problem of recovering an “original” appearance. Some materials were altered by the artist, others by aging, and still others by earlier conservation. Because cleaning is often difficult to reverse, responsible treatment requires documenting uncertainty and consulting curators, scientists, and communities for whom the object has significance. The goal is not to freeze a work outside history but to intervene without pretending that history is irrelevant.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The passage suggests that responsible restoration requires',
        choices: [
          'removing every trace of a painting’s age',
          'recovering a single indisputable original state',
          'balancing visual recovery with evidence of the work’s history',
          'allowing only scientists to decide how a painting should look',
          'avoiding documentation until treatment is complete',
        ],
        answer: [2],
        explanation: 'The author rejects a purely original-state goal and stresses uncertainty, historical layers, consultation, and reversibility.',
        skills: ['main idea', 'ethical reasoning'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements are consistent with the passage? Select all that apply.',
        choices: [
          'An original appearance is the only legitimate restoration objective.',
          'A painting’s patina may itself carry historical significance.',
          'The difficulty of reversing a treatment increases the need for deliberation.',
        ],
        answer: [1, 2],
        explanation: 'The passage treats patina as historically meaningful and links irreversible cleaning to documentation and consultation. It denies a single original appearance as the sole objective.',
        skills: ['detail', 'inference'],
      },
    ],
  },
  {
    id: 'rc-p16',
    title: 'Screening and base rates',
    text: 'A medical screening test can be highly sensitive and specific yet still produce many false alarms when used for a rare disease. If only one person in ten thousand has the condition, even a small false-positive rate may identify far more healthy people than sick ones. This arithmetic does not imply that screening is pointless. It means that benefit depends on prevalence, the availability of confirmatory testing, and the harms caused by unnecessary procedures or anxiety. Accuracy statistics describe a test; they do not by themselves determine whether a screening program is wise.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The passage’s central claim is that',
        choices: [
          'rare diseases should never be screened for',
          'sensitivity is the only relevant measure of a test',
          'test accuracy alone does not determine the value of a screening program',
          'false positives occur only when a test lacks specificity',
          'confirmatory testing always eliminates harm',
        ],
        answer: [2],
        explanation: 'The author explains why prevalence and downstream consequences must be considered alongside sensitivity and specificity.',
        skills: ['main idea', 'quantitative reasoning in prose'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which statements are supported by the passage? Select all that apply.',
        choices: [
          'High sensitivity and specificity guarantee that population screening is beneficial.',
          'Disease prevalence affects how positive results should be interpreted.',
          'The consequences of follow-up procedures are relevant to screening policy.',
        ],
        answer: [1, 2],
        explanation: 'The passage explicitly makes prevalence and downstream harms relevant and denies that accuracy statistics alone guarantee a wise program.',
        skills: ['inference', 'policy evaluation'],
      },
    ],
  },
  {
    id: 'rc-p17',
    title: 'Registration and voter turnout',
    text: 'Automatic voter registration has increased the number of eligible citizens on electoral rolls, but its effect on turnout is often modest. Registration removes an administrative barrier; it does not necessarily supply information, transportation, or a sense that an election is consequential. Field studies show larger effects when registration reform is paired with reminders or community mobilization. These findings neither trivialize administrative reform nor make participation campaigns redundant. They indicate that being able to vote and being motivated to vote are distinct conditions that policy can address in complementary ways.',
    questions: [
      {
        difficulty: 'easy',
        format: 'single',
        stem: 'Which choice best summarizes the passage?',
        choices: [
          'Automatic registration always produces a large increase in turnout.',
          'Community mobilization matters only where registration is difficult.',
          'Registration reform and participation efforts address different barriers to voting.',
          'Administrative barriers are the sole cause of low turnout.',
          'Reminders make electoral registration unnecessary.',
        ],
        answer: [2],
        explanation: 'The passage distinguishes ability from motivation and treats registration reform and mobilization as complementary.',
        skills: ['main idea', 'distinction'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements are supported? Select all that apply.',
        choices: [
          'Automatic registration by itself invariably causes a substantial turnout increase.',
          'Registration reform can reduce administrative friction.',
          'Information and mobilization may still matter after registration becomes automatic.',
        ],
        answer: [1, 2],
        explanation: 'The passage credits automatic registration with removing a barrier but says turnout effects are modest unless other motivational factors are addressed.',
        skills: ['detail', 'causal reasoning'],
      },
    ],
  },
  {
    id: 'rc-p18',
    title: 'Slow earthquakes',
    text: 'For decades, earthquakes were classified as either sudden ruptures that radiate damaging seismic waves or harmless gradual movement. Sensitive instruments have revealed a less tidy category: slow-slip events release strain over days or months and may produce little ordinary shaking. Whether these events reduce the likelihood of a major earthquake by relieving stress or increase it by transferring stress remains unsettled and may vary by fault. Their discovery is valuable precisely because it replaces a simple dichotomy with a spectrum of fault behavior that can now be measured.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The discovery of slow-slip events is important primarily because it',
        choices: [
          'proves that major earthquakes can be predicted exactly',
          'shows that all gradual fault movement is harmless',
          'reveals a measurable form of behavior between two traditional categories',
          'demonstrates that stress transfer never occurs',
          'eliminates the need for sensitive instruments',
        ],
        answer: [2],
        explanation: 'Slow-slip events complicate the sudden-versus-harmless dichotomy and create a measurable spectrum of fault behavior.',
        skills: ['main idea', 'classification'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which statements are supported by the passage? Select all that apply.',
        choices: [
          'Slow-slip events eliminate the risk of a later major earthquake.',
          'The events challenge a formerly simple classification of fault movement.',
          'Their effect on future earthquake hazard is not yet fully resolved.',
        ],
        answer: [1, 2],
        explanation: 'The passage explicitly says the events complicate the dichotomy and that their hazard implications remain unsettled.',
        skills: ['detail', 'uncertainty'],
      },
    ],
  },
  {
    id: 'rc-p19',
    title: 'Explaining machine-learning models',
    text: 'A simple explanation of a machine-learning prediction can be useful to a doctor or loan applicant, but simplicity may come at the cost of fidelity. A short list of influential features can conceal interactions on which the model actually depends. Conversely, a perfectly faithful account may be too complex for a person to use. Interpretability is therefore not a single property that one method maximizes. An explanation meant to help an engineer debug a system may appropriately differ from one meant to let an affected person contest a decision. Evaluation should begin with the explanation’s purpose and audience.',
    questions: [
      {
        difficulty: 'hard',
        format: 'single',
        stem: 'The author’s main point is that interpretability methods should be evaluated according to',
        choices: [
          'whether they produce the shortest possible explanation',
          'their fidelity alone, regardless of usability',
          'the specific purpose and audience of the explanation',
          'whether they hide all feature interactions',
          'a single universal definition of simplicity',
        ],
        answer: [2],
        explanation: 'The passage presents a fidelity-usability tradeoff and concludes that purpose and audience should guide evaluation.',
        skills: ['main idea', 'trade-off'],
      },
      {
        difficulty: 'hard',
        format: 'multiple',
        stem: 'Which statements follow from the passage? Select all that apply.',
        choices: [
          'One explanation method should be preferred for every use case.',
          'A simple explanation can misrepresent dependencies in a model.',
          'The intended user can affect what counts as a useful explanation.',
        ],
        answer: [1, 2],
        explanation: 'The author warns that simplicity can conceal interactions and distinguishes explanations for engineers from those for affected people.',
        skills: ['inference', 'application'],
      },
    ],
  },
  {
    id: 'rc-p20',
    title: 'Museums and repatriation',
    text: 'Debates over museum repatriation are often framed as a choice between universal public access and the return of objects to originating communities. Collaborative custody arrangements complicate that binary. Long-term loans, rotating displays, and shared digital archives can expand access while giving source communities greater authority over interpretation and care. Such arrangements do not dissolve disputes about legal title or remedy every historical injustice. They do, however, show that access and control need not always move in opposite directions, and they create practical relationships through which broader claims can be negotiated.',
    questions: [
      {
        difficulty: 'medium',
        format: 'single',
        stem: 'The passage presents collaborative custody arrangements as',
        choices: [
          'a complete solution to every dispute over legal title',
          'evidence that public access and community authority can sometimes coexist',
          'a reason to reject all repatriation claims',
          'a method for replacing physical objects with digital copies',
          'proof that historical injustice is irrelevant to museums',
        ],
        answer: [1],
        explanation: 'The author does not claim a complete solution but uses collaborative arrangements to challenge a strict access-versus-control binary.',
        skills: ['main idea', 'qualification'],
      },
      {
        difficulty: 'medium',
        format: 'multiple',
        stem: 'Which statements are supported by the passage? Select all that apply.',
        choices: [
          'Collaborative custody necessarily ends conflicts over ownership.',
          'Repatriation debates concern interpretive authority as well as physical access.',
          'Shared arrangements can create new options for negotiating broader claims.',
        ],
        answer: [1, 2],
        explanation: 'The passage discusses authority over interpretation and says collaborative relationships can support negotiation, while explicitly denying that they dissolve title disputes.',
        skills: ['inference', 'detail'],
      },
    ],
  },
]

const tcSingle = [
  {
    difficulty: 'easy',
    text: 'Although the professor’s summary was terse, it was hardly {{blank1}}; every inference was stated with unusual clarity.',
    choices: ['lucid', 'opaque', 'redundant', 'ornate', 'derivative'],
    answer: 1,
    explanation: '“Although” creates a contrast: the summary was brief but not difficult to understand. “Opaque” supplies that rejected quality.',
  },
  {
    difficulty: 'medium',
    text: 'The committee praised the proposal’s novelty but warned that its evidence was preliminary, so its endorsement was distinctly {{blank1}}.',
    choices: ['unreserved', 'qualified', 'perfunctory', 'hostile', 'irrelevant'],
    answer: 1,
    explanation: 'Praise followed by a warning makes the endorsement limited or “qualified,” not unreserved.',
  },
  {
    difficulty: 'easy',
    text: 'By replacing technical jargon with concrete examples, the curator made a once-arcane subject remarkably {{blank1}}.',
    choices: ['accessible', 'esoteric', 'speculative', 'tedious', 'contentious'],
    answer: 0,
    explanation: 'Concrete examples and reduced jargon make a subject easier to understand, or accessible.',
  },
  {
    difficulty: 'medium',
    text: 'Initially dismissive of the hypothesis, the biologist became increasingly {{blank1}} after three independent laboratories reproduced the result.',
    choices: ['receptive', 'indifferent', 'dogmatic', 'incredulous', 'secretive'],
    answer: 0,
    explanation: 'Independent replication would make a formerly skeptical scientist more receptive to the hypothesis.',
  },
  {
    difficulty: 'medium',
    text: 'The historian uses the diary not as proof that every worker shared its author’s views, but as an {{blank1}} example of one worker’s experience.',
    choices: ['exhaustive', 'illustrative', 'representative', 'fraudulent', 'inconsequential'],
    answer: 1,
    explanation: 'The contrast rejects universal representativeness; the diary illustrates one possible experience.',
  },
  {
    difficulty: 'medium',
    text: 'The report’s calm prose {{blank1}} the urgency of its recommendations, which called for immediate action.',
    choices: ['amplified', 'belied', 'demonstrated', 'created', 'resolved'],
    answer: 1,
    explanation: 'A calm tone contrasts with urgent recommendations, so it “belied,” or gave a misleading impression of, their urgency.',
  },
  {
    difficulty: 'easy',
    text: 'Once dismissed as {{blank1}}, the theory is now so widely accepted that textbooks present it without controversy.',
    choices: ['orthodox', 'heterodox', 'obvious', 'methodical', 'empirical'],
    answer: 1,
    explanation: 'The shift from dismissal to widespread acceptance requires a word meaning unorthodox: “heterodox.”',
  },
  {
    difficulty: 'easy',
    text: 'The editor removed several digressions, making the essay more {{blank1}} without sacrificing its complexity.',
    choices: ['lucid', 'verbose', 'fragmentary', 'equivocal', 'ornamental'],
    answer: 0,
    explanation: 'Removing digressions improves clarity, making the essay more lucid.',
  },
  {
    difficulty: 'medium',
    text: 'The witness’s account seemed evasive until time-stamped records {{blank1}} its central claim.',
    choices: ['contradicted', 'corroborated', 'obscured', 'trivialized', 'anticipated'],
    answer: 1,
    explanation: 'The records rescued the account from suspicion by confirming, or corroborating, its main claim.',
  },
  {
    difficulty: 'hard',
    text: 'Her generosity was not entirely spontaneous; it was a {{blank1}} gesture designed to secure the board’s support.',
    choices: ['capricious', 'strategic', 'magnanimous', 'inadvertent', 'futile'],
    answer: 1,
    explanation: 'The stated purpose—securing support—shows that the gesture was calculated or strategic.',
  },
]

const tcDouble = [
  {
    difficulty: 'easy',
    text: 'Because the surviving evidence is {{blank1}}, the archaeologist presents her conclusion as {{blank2}} rather than definitive.',
    blanks: [
      ['fragmentary', 'copious', 'conclusive'],
      ['tentative', 'immutable', 'obvious'],
    ],
    answer: [0, 0],
    explanation: 'Incomplete (“fragmentary”) evidence warrants a provisional (“tentative”) conclusion.',
  },
  {
    difficulty: 'medium',
    text: 'The reviewer admired the book’s {{blank1}} ambition but found its execution uneven and several of its central claims {{blank2}}.',
    blanks: [
      ['timid', 'sweeping', 'negligible'],
      ['underdeveloped', 'irrefutable', 'meticulous'],
    ],
    answer: [1, 0],
    explanation: 'The contrast pairs large or sweeping ambition with claims that are insufficiently developed.',
  },
  {
    difficulty: 'medium',
    text: 'A policy intended to {{blank1}} the application process instead produced a {{blank2}} set of requirements that frustrated applicants.',
    blanks: [
      ['simplify', 'publicize', 'postpone'],
      ['transparent', 'labyrinthine', 'minimal'],
    ],
    answer: [0, 1],
    explanation: '“Instead” signals failure: an intended simplification yielded confusing, labyrinthine requirements.',
  },
  {
    difficulty: 'hard',
    text: 'The poet’s language is {{blank1}} but not impoverished; its very restraint {{blank2}} the emotional force of each image.',
    blanks: [
      ['austere', 'florid', 'careless'],
      ['dilutes', 'intensifies', 'conceals'],
    ],
    answer: [0, 1],
    explanation: 'The sentence praises restraint: austere language intensifies rather than weakens the images.',
  },
  {
    difficulty: 'medium',
    text: 'The model is mathematically {{blank1}}, yet its unrealistic assumptions make its practical predictions {{blank2}}.',
    blanks: [
      ['elegant', 'incoherent', 'derivative'],
      ['reliable', 'unreliable', 'inevitable'],
    ],
    answer: [0, 1],
    explanation: '“Yet” contrasts formal elegance with practical unreliability caused by unrealistic assumptions.',
  },
  {
    difficulty: 'medium',
    text: 'Known for being {{blank1}} in meetings, the manager surprised everyone with an unusually {{blank2}} defense of the plan.',
    blanks: [
      ['taciturn', 'effusive', 'combative'],
      ['expansive', 'laconic', 'evasive'],
    ],
    answer: [0, 0],
    explanation: 'The surprise comes from a normally quiet, taciturn person giving a lengthy, expansive defense.',
  },
  {
    difficulty: 'medium',
    text: 'The discovery was initially dismissed as an {{blank1}}, but it later became the {{blank2}} for an entirely new research program.',
    blanks: [
      ['anomaly', 'orthodoxy', 'axiom'],
      ['impediment', 'catalyst', 'epilogue'],
    ],
    answer: [0, 1],
    explanation: 'What looked like an anomalous result later stimulated, or catalyzed, new research.',
  },
  {
    difficulty: 'hard',
    text: 'The critic’s praise was so {{blank1}} that readers suspected it was parody rather than sincere {{blank2}}.',
    blanks: [
      ['measured', 'effusive', 'ambivalent'],
      ['censure', 'endorsement', 'indifference'],
    ],
    answer: [1, 1],
    explanation: 'Excessively enthusiastic (“effusive”) praise can sound parodic rather than like sincere endorsement.',
  },
  {
    difficulty: 'medium',
    text: 'Although the archive contains {{blank1}} data, the material became genuinely {{blank2}} only after researchers refined their categories.',
    blanks: [
      ['abundant', 'scant', 'fabricated'],
      ['informative', 'redundant', 'inaccessible'],
    ],
    answer: [0, 0],
    explanation: 'The contrast distinguishes abundant raw data from information made useful through better categories.',
  },
  {
    difficulty: 'hard',
    text: 'The compromise appeared {{blank1}} on paper, but in practice its costs fell {{blank2}} on the smallest organizations.',
    blanks: [
      ['equitable', 'punitive', 'opaque'],
      ['randomly', 'disproportionately', 'lightly'],
    ],
    answer: [0, 1],
    explanation: 'The “but” contrast pits apparent fairness against a disproportionate burden on small organizations.',
  },
]

const tcTriple = [
  {
    difficulty: 'hard',
    text: 'Skeptical of {{blank1}} theories, the scientist preferred claims that were {{blank2}} enough to test and provisional enough to permit {{blank3}}.',
    blanks: [
      ['sweeping', 'modest', 'empirical'],
      ['vague', 'specific', 'ornate'],
      ['revision', 'dogma', 'obscurity'],
    ],
    answer: [0, 1, 0],
    explanation: 'The scientist distrusts sweeping theories and values specific, testable claims open to revision.',
  },
  {
    difficulty: 'hard',
    text: 'The biography is vivid but {{blank1}}: it {{blank2}} dramatic episodes while omitting contrary evidence, producing a portrait that is compelling yet {{blank3}}.',
    blanks: [
      ['selective', 'exhaustive', 'dispassionate'],
      ['minimizes', 'dramatizes', 'verifies'],
      ['partial', 'definitive', 'tedious'],
    ],
    answer: [0, 1, 0],
    explanation: 'Selective emphasis on dramatic episodes creates an engaging but incomplete, or partial, portrait.',
  },
  {
    difficulty: 'hard',
    text: 'Though the regulation was praised for its {{blank1}}, its implementation was {{blank2}}: agencies interpreted the same clause differently, making compliance {{blank3}}.',
    blanks: [
      ['clarity', 'severity', 'novelty'],
      ['uniform', 'haphazard', 'swift'],
      ['predictable', 'inexpensive', 'uncertain'],
    ],
    answer: [0, 1, 2],
    explanation: 'Praise for clarity contrasts with inconsistent implementation, which makes compliance uncertain.',
  },
  {
    difficulty: 'hard',
    text: 'The philosopher’s style appears {{blank1}}, but the underlying argument is surprisingly {{blank2}}; much of the difficulty comes from specialized terminology rather than {{blank3}} reasoning.',
    blanks: [
      ['forbidding', 'transparent', 'playful'],
      ['simple', 'convoluted', 'speculative'],
      ['lucid', 'complex', 'rigorous'],
    ],
    answer: [0, 0, 1],
    explanation: 'The surface is forbidding, yet the argument is simple; terminology, not complex reasoning, creates the difficulty.',
  },
  {
    difficulty: 'medium',
    text: 'The startup’s publicity was {{blank1}}, but its product remained {{blank2}}; once customers tried it, early enthusiasm quickly {{blank3}}.',
    blanks: [
      ['ubiquitous', 'muted', 'secretive'],
      ['innovative', 'rudimentary', 'reliable'],
      ['intensified', 'evaporated', 'stabilized'],
    ],
    answer: [0, 1, 1],
    explanation: 'Omnipresent publicity cannot sustain enthusiasm for a rudimentary product, so enthusiasm evaporates.',
  },
  {
    difficulty: 'hard',
    text: 'The restoration claimed to be {{blank1}}, yet it relied on {{blank2}} colors for which no evidence survived, making the result less a recovery than a {{blank3}} reconstruction.',
    blanks: [
      ['faithful', 'innovative', 'reversible'],
      ['documented', 'conjectural', 'muted'],
      ['speculative', 'meticulous', 'minimal'],
    ],
    answer: [0, 1, 0],
    explanation: 'A supposedly faithful restoration based on conjectural colors is necessarily speculative.',
  },
  {
    difficulty: 'hard',
    text: 'Rather than offer a {{blank1}} forecast, the economist emphasized {{blank2}}, presenting a range of outcomes that reflected appropriate intellectual {{blank3}}.',
    blanks: [
      ['precise', 'cautious', 'remote'],
      ['certainty', 'uncertainty', 'consensus'],
      ['arrogance', 'humility', 'indifference'],
    ],
    answer: [0, 1, 1],
    explanation: 'Rejecting false precision, the economist highlights uncertainty and shows humility through a range of outcomes.',
  },
  {
    difficulty: 'medium',
    text: 'The committee’s debate was {{blank1}}, but its final report was so {{blank2}} that it largely {{blank3}} the depth of the members’ disagreement.',
    blanks: [
      ['acrimonious', 'cordial', 'brief'],
      ['measured', 'inflammatory', 'careless'],
      ['revealed', 'concealed', 'resolved'],
    ],
    answer: [0, 0, 1],
    explanation: 'A bitter debate contrasts with a restrained report that concealed, rather than displayed, the disagreement.',
  },
  {
    difficulty: 'hard',
    text: 'The novel’s {{blank1}} structure is initially disorienting, but recurring images reveal a {{blank2}} pattern, and the apparent chaos gradually resolves into {{blank3}}.',
    blanks: [
      ['fragmented', 'linear', 'predictable'],
      ['deliberate', 'accidental', 'negligible'],
      ['coherence', 'ambiguity', 'parody'],
    ],
    answer: [0, 0, 0],
    explanation: 'Fragmentation first looks chaotic, but deliberate recurrence ultimately creates coherence.',
  },
  {
    difficulty: 'hard',
    text: 'The historian does not treat archives as {{blank1}} windows onto the past; because records were produced by particular institutions, they must be read {{blank2}} rather than accepted as {{blank3}} evidence.',
    blanks: [
      ['transparent', 'distorted', 'narrow'],
      ['critically', 'literally', 'rapidly'],
      ['neutral', 'fragmentary', 'hostile'],
    ],
    answer: [0, 0, 0],
    explanation: 'Archives are not transparent: institutional records require critical reading and cannot be assumed neutral.',
  },
]

const sentenceEquivalence = [
  {
    difficulty: 'easy',
    text: 'By using a concrete analogy, the lecturer made an otherwise abstruse theory remarkably {{blank1}}.',
    choices: ['intelligible', 'orthodox', 'lucid', 'controversial', 'exhaustive', 'tedious'],
    answer: [0, 2],
    explanation: '“Intelligible” and “lucid” both mean clear and understandable, fitting the effect of a concrete analogy.',
  },
  {
    difficulty: 'medium',
    text: 'Because the apology was delivered without reflection and immediately forgotten, it seemed entirely {{blank1}}.',
    choices: ['contrite', 'perfunctory', 'cursory', 'sincere', 'elaborate', 'vindictive'],
    answer: [1, 2],
    explanation: '“Perfunctory” and “cursory” both describe something done hastily with little care.',
  },
  {
    difficulty: 'medium',
    text: 'The newly discovered correspondence did not merely weaken the accusation; it appeared to {{blank1}} the accused official.',
    choices: ['implicate', 'exonerate', 'reproach', 'absolve', 'confound', 'restrain'],
    answer: [1, 3],
    explanation: '“Exonerate” and “absolve” both mean clear from blame, matching the stronger contrast with merely weakening the accusation.',
  },
  {
    difficulty: 'easy',
    text: 'Without additional funding or staff, the committee’s ambitious timetable is plainly {{blank1}}.',
    choices: ['equitable', 'impracticable', 'unworkable', 'methodical', 'provisional', 'lucrative'],
    answer: [1, 2],
    explanation: '“Impracticable” and “unworkable” both mean impossible to carry out under the stated constraints.',
  },
  {
    difficulty: 'medium',
    text: 'Far from being hostile, the critic’s assessment of the debut novel was consistently {{blank1}}.',
    choices: ['laudatory', 'ambivalent', 'complimentary', 'caustic', 'perfunctory', 'opaque'],
    answer: [0, 2],
    explanation: '“Laudatory” and “complimentary” both indicate praise and contrast with hostility.',
  },
  {
    difficulty: 'easy',
    text: 'During the interview, the normally voluble actor became unexpectedly {{blank1}}, offering only monosyllabic replies.',
    choices: ['taciturn', 'animated', 'reticent', 'candid', 'dogmatic', 'effusive'],
    answer: [0, 2],
    explanation: '“Taciturn” and “reticent” both describe reluctance to speak, as shown by the monosyllabic replies.',
  },
  {
    difficulty: 'easy',
    text: 'The enthusiasm surrounding the minor discovery proved {{blank1}}; within a week, public attention had shifted elsewhere.',
    choices: ['durable', 'ephemeral', 'transient', 'profound', 'ubiquitous', 'measured'],
    answer: [1, 2],
    explanation: '“Ephemeral” and “transient” both mean short-lived.',
  },
  {
    difficulty: 'medium',
    text: 'Given the study’s tiny sample and missing controls, its sweeping conclusion is at best {{blank1}}.',
    choices: ['definitive', 'dubious', 'questionable', 'innovative', 'orthodox', 'lucid'],
    answer: [1, 2],
    explanation: '“Dubious” and “questionable” both express justified doubt about the conclusion.',
  },
  {
    difficulty: 'hard',
    text: 'The foundation’s {{blank1}} support allowed the small archive to acquire materials it could never otherwise have afforded.',
    choices: ['sporadic', 'munificent', 'bountiful', 'reluctant', 'negligible', 'conditional'],
    answer: [1, 2],
    explanation: '“Munificent” and “bountiful” both describe exceptionally generous support.',
  },
  {
    difficulty: 'easy',
    text: 'Because the itinerary can be revised at short notice, it remains admirably {{blank1}}.',
    choices: ['rigid', 'adaptable', 'flexible', 'cryptic', 'exhaustive', 'precarious'],
    answer: [1, 2],
    explanation: '“Adaptable” and “flexible” both describe an itinerary that can be readily revised.',
  },
  {
    difficulty: 'medium',
    text: 'The manual is admirably {{blank1}}: it explains the procedure in three pages without omitting any essential step.',
    choices: ['verbose', 'concise', 'terse', 'ambiguous', 'derivative', 'ornate'],
    answer: [1, 2],
    explanation: '“Concise” and “terse” both mean brief; the positive context rules out a sense of unhelpful abruptness.',
  },
  {
    difficulty: 'hard',
    text: 'Pressed to endorse either proposal, the minister remained {{blank1}}, carefully avoiding a definite commitment.',
    choices: ['unequivocal', 'equivocal', 'ambiguous', 'indignant', 'prescient', 'magnanimous'],
    answer: [1, 2],
    explanation: '“Equivocal” and “ambiguous” both describe language that avoids a clear commitment.',
  },
  {
    difficulty: 'medium',
    text: 'Because every other trial produced the expected result, the single contrary finding appeared {{blank1}}.',
    choices: ['representative', 'anomalous', 'aberrant', 'inevitable', 'conclusive', 'mundane'],
    answer: [1, 2],
    explanation: '“Anomalous” and “aberrant” both mark the finding as a deviation from the pattern.',
  },
  {
    difficulty: 'medium',
    text: 'The policy’s effect on small farms was not merely inconvenient but positively {{blank1}}.',
    choices: ['salutary', 'injurious', 'detrimental', 'negligible', 'fortuitous', 'equitable'],
    answer: [1, 2],
    explanation: '“Injurious” and “detrimental” both mean harmful, intensifying “inconvenient.”',
  },
  {
    difficulty: 'medium',
    text: 'The researcher was so {{blank1}} that even minor discrepancies in the laboratory notes received careful investigation.',
    choices: ['capricious', 'meticulous', 'scrupulous', 'impetuous', 'indifferent', 'speculative'],
    answer: [1, 2],
    explanation: '“Meticulous” and “scrupulous” both describe extreme care and attention to detail.',
  },
  {
    difficulty: 'medium',
    text: 'Although the speaker’s central thesis was simple, her presentation was so {{blank1}} that the audience repeatedly lost track of it.',
    choices: ['succinct', 'digressive', 'rambling', 'lucid', 'methodical', 'incisive'],
    answer: [1, 2],
    explanation: '“Digressive” and “rambling” both describe a presentation that wanders away from its main point.',
  },
  {
    difficulty: 'hard',
    text: 'The analyst’s warning, dismissed as alarmist at the time, later seemed remarkably {{blank1}}.',
    choices: ['prescient', 'derivative', 'prophetic', 'opaque', 'perfunctory', 'belated'],
    answer: [0, 2],
    explanation: '“Prescient” and “prophetic” both describe an accurate anticipation of later events.',
  },
  {
    difficulty: 'easy',
    text: 'Negotiations became so {{blank1}} that representatives could barely discuss procedural details without trading insults.',
    choices: ['cordial', 'acrimonious', 'bitter', 'methodical', 'fruitful', 'restrained'],
    answer: [1, 2],
    explanation: '“Acrimonious” and “bitter” both fit an exchange characterized by insults and hostility.',
  },
  {
    difficulty: 'medium',
    text: 'Even after the project suffered several reversals, the director’s support remained {{blank1}}.',
    choices: ['conditional', 'steadfast', 'unwavering', 'perfunctory', 'erratic', 'tacit'],
    answer: [1, 2],
    explanation: '“Steadfast” and “unwavering” both indicate support that does not diminish after setbacks.',
  },
  {
    difficulty: 'easy',
    text: 'For the purposes of this broad survey, the distinction between the two minor variants is {{blank1}}.',
    choices: ['fundamental', 'negligible', 'inconsequential', 'contentious', 'lucid', 'unprecedented'],
    answer: [1, 2],
    explanation: '“Negligible” and “inconsequential” both indicate that the distinction does not materially affect the survey.',
  },
  {
    difficulty: 'medium',
    text: 'Although direct evidence is unavailable, the researcher’s explanation remains {{blank1}} because it fits every known fact.',
    choices: ['implausible', 'credible', 'plausible', 'exhaustive', 'capricious', 'obsolete'],
    answer: [1, 2],
    explanation: '“Credible” and “plausible” both describe an explanation that is believable given the evidence.',
  },
  {
    difficulty: 'medium',
    text: 'Once essential to the manufacturing process, the custom is now technologically {{blank1}}.',
    choices: ['innovative', 'archaic', 'obsolete', 'pragmatic', 'expedient', 'ubiquitous'],
    answer: [1, 2],
    explanation: '“Archaic” and “obsolete” both describe a practice superseded by newer technology.',
  },
  {
    difficulty: 'hard',
    text: 'Employees found the manager’s decisions {{blank1}}: policies changed abruptly according to his mood.',
    choices: ['systematic', 'capricious', 'whimsical', 'equitable', 'transparent', 'deliberate'],
    answer: [1, 2],
    explanation: '“Capricious” and “whimsical” both convey decisions governed by unpredictable impulses.',
  },
  {
    difficulty: 'easy',
    text: 'The report draws on {{blank1}} evidence, including hundreds of interviews and decades of records.',
    choices: ['scant', 'abundant', 'copious', 'dubious', 'anecdotal', 'irrelevant'],
    answer: [1, 2],
    explanation: '“Abundant” and “copious” both match the very large quantity of evidence described.',
  },
  {
    difficulty: 'medium',
    text: 'The reform proved {{blank1}}, reducing delays while expanding access to legal assistance.',
    choices: ['detrimental', 'salutary', 'beneficial', 'cosmetic', 'contentious', 'futile'],
    answer: [1, 2],
    explanation: '“Salutary” and “beneficial” both mean producing a good effect.',
  },
  {
    difficulty: 'hard',
    text: 'Despite the disappointing forecast, the team remained {{blank1}}, joking easily and planning its next attempt.',
    choices: ['morose', 'buoyant', 'ebullient', 'reticent', 'apathetic', 'austere'],
    answer: [1, 2],
    explanation: '“Buoyant” and “ebullient” both describe a cheerful, lively mood despite bad news.',
  },
  {
    difficulty: 'hard',
    text: 'The essay’s critique is unusually {{blank1}}, identifying the assumption on which the entire argument depends.',
    choices: ['superficial', 'incisive', 'penetrating', 'diffuse', 'perfunctory', 'equivocal'],
    answer: [1, 2],
    explanation: '“Incisive” and “penetrating” both describe analysis that reaches the core of an argument.',
  },
  {
    difficulty: 'medium',
    text: 'Because several measurements still need confirmation, the agreement among the researchers remains {{blank1}}.',
    choices: ['final', 'provisional', 'tentative', 'acrimonious', 'unanimous', 'irrelevant'],
    answer: [1, 2],
    explanation: '“Provisional” and “tentative” both indicate an agreement subject to revision as evidence develops.',
  },
  {
    difficulty: 'hard',
    text: 'The editorial’s {{blank1}} language transformed a manageable disagreement into a public confrontation.',
    choices: ['measured', 'inflammatory', 'incendiary', 'conciliatory', 'equivocal', 'technical'],
    answer: [1, 2],
    explanation: '“Inflammatory” and “incendiary” both describe language likely to provoke conflict.',
  },
  {
    difficulty: 'medium',
    text: 'The scholar’s lectures were demanding but deeply {{blank1}}, ranging confidently across several centuries of intellectual history.',
    choices: ['parochial', 'erudite', 'learned', 'perfunctory', 'dogmatic', 'inaccessible'],
    answer: [1, 2],
    explanation: '“Erudite” and “learned” both describe extensive scholarly knowledge.',
  },
]

const questions = []
let sequence = 1

for (const passage of rcPassages) {
  passage.questions.forEach((question) => {
    const id = `rc-${String(sequence).padStart(3, '0')}`
    questions.push({
      id,
      number: sequence,
      type: 'reading-comprehension',
      difficulty: question.difficulty,
      passageId: passage.id,
      stem: question.stem,
      directions: question.format === 'multiple'
        ? 'Select all answer choices that apply. You must select every correct choice.'
        : 'Select one answer choice.',
      responseGroups: [{
        id: 'main',
        label: 'Answer choices',
        selectionMode: question.format === 'multiple' ? 'multiple' : 'single',
        requiredSelections: question.format === 'multiple' ? null : 1,
        choices: makeChoices(question.choices),
      }],
      correctAnswer: { main: question.answer.map((index) => choiceIds[index]) },
      explanation: question.explanation,
      skills: question.skills,
      source: 'Original GRE-style practice created for Choco GRE',
    })
    sequence += 1
  })
}

tcSingle.forEach((question, index) => {
  const id = `tc-${String(index + 1).padStart(3, '0')}`
  questions.push({
    id,
    number: sequence,
    type: 'text-completion',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select one answer choice for the blank.',
    responseGroups: [{
      id: 'blank1',
      label: 'Blank (i)',
      selectionMode: 'single',
      requiredSelections: 1,
      choices: makeChoices(question.choices),
    }],
    correctAnswer: { blank1: [choiceIds[question.answer]] },
    explanation: question.explanation,
    skills: ['context clues', 'sentence logic'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

tcDouble.forEach((question, index) => {
  const id = `tc-${String(tcSingle.length + index + 1).padStart(3, '0')}`
  questions.push({
    id,
    number: sequence,
    type: 'text-completion',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select one answer choice for each blank. There is no partial credit.',
    responseGroups: question.blanks.map((blank, blankIndex) => ({
      id: `blank${blankIndex + 1}`,
      label: `Blank (${['i', 'ii'][blankIndex]})`,
      selectionMode: 'single',
      requiredSelections: 1,
      choices: makeChoices(blank),
    })),
    correctAnswer: Object.fromEntries(question.answer.map((answer, blankIndex) => [
      `blank${blankIndex + 1}`,
      [choiceIds[answer]],
    ])),
    explanation: question.explanation,
    skills: ['context clues', 'multi-blank coherence'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

tcTriple.forEach((question, index) => {
  const id = `tc-${String(tcSingle.length + tcDouble.length + index + 1).padStart(3, '0')}`
  questions.push({
    id,
    number: sequence,
    type: 'text-completion',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select one answer choice for each blank. There is no partial credit.',
    responseGroups: question.blanks.map((blank, blankIndex) => ({
      id: `blank${blankIndex + 1}`,
      label: `Blank (${['i', 'ii', 'iii'][blankIndex]})`,
      selectionMode: 'single',
      requiredSelections: 1,
      choices: makeChoices(blank),
    })),
    correctAnswer: Object.fromEntries(question.answer.map((answer, blankIndex) => [
      `blank${blankIndex + 1}`,
      [choiceIds[answer]],
    ])),
    explanation: question.explanation,
    skills: ['context clues', 'multi-blank coherence'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

sentenceEquivalence.forEach((question, index) => {
  const id = `se-${String(index + 1).padStart(3, '0')}`
  questions.push({
    id,
    number: sequence,
    type: 'sentence-equivalence',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select exactly two answer choices that complete the sentence and produce equivalent meanings.',
    responseGroups: [{
      id: 'main',
      label: 'Select two',
      selectionMode: 'multiple',
      requiredSelections: 2,
      choices: makeChoices(question.choices),
    }],
    correctAnswer: { main: question.answer.map((answer) => choiceIds[answer]) },
    explanation: question.explanation,
    skills: ['sentence logic', 'equivalent meaning'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

let additionalRcIndex = rcPassages.reduce((total, passage) => total + passage.questions.length, 0)
for (const passage of additionalRcPassages) {
  passage.questions.forEach((question) => {
    additionalRcIndex += 1
    questions.push({
      id: `rc-${String(additionalRcIndex).padStart(3, '0')}`,
      number: sequence,
      type: 'reading-comprehension',
      difficulty: question.difficulty,
      passageId: passage.id,
      stem: question.stem,
      directions: question.format === 'multiple'
        ? 'Select all answer choices that apply. You must select every correct choice.'
        : 'Select one answer choice.',
      responseGroups: [{
        id: 'main',
        label: 'Answer choices',
        selectionMode: question.format === 'multiple' ? 'multiple' : 'single',
        requiredSelections: question.format === 'multiple' ? null : 1,
        choices: makeChoices(question.choices),
      }],
      correctAnswer: { main: question.answer.map((index) => choiceIds[index]) },
      explanation: question.explanation,
      skills: question.skills,
      source: 'Original GRE-style practice created for Choco GRE',
    })
    sequence += 1
  })
}

let additionalTcIndex = tcSingle.length + tcDouble.length + tcTriple.length
additionalTcSingle.forEach((question) => {
  additionalTcIndex += 1
  questions.push({
    id: `tc-${String(additionalTcIndex).padStart(3, '0')}`,
    number: sequence,
    type: 'text-completion',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select one answer choice for the blank.',
    responseGroups: [{
      id: 'blank1',
      label: 'Blank (i)',
      selectionMode: 'single',
      requiredSelections: 1,
      choices: makeChoices(question.choices),
    }],
    correctAnswer: { blank1: [choiceIds[question.answer]] },
    explanation: question.explanation,
    skills: ['context clues', 'sentence logic'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

additionalTcDouble.forEach((question) => {
  additionalTcIndex += 1
  questions.push({
    id: `tc-${String(additionalTcIndex).padStart(3, '0')}`,
    number: sequence,
    type: 'text-completion',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select one answer choice for each blank. There is no partial credit.',
    responseGroups: question.blanks.map((blank, blankIndex) => ({
      id: `blank${blankIndex + 1}`,
      label: `Blank (${['i', 'ii'][blankIndex]})`,
      selectionMode: 'single',
      requiredSelections: 1,
      choices: makeChoices(blank),
    })),
    correctAnswer: Object.fromEntries(question.answer.map((answer, blankIndex) => [
      `blank${blankIndex + 1}`,
      [choiceIds[answer]],
    ])),
    explanation: question.explanation,
    skills: ['context clues', 'multi-blank coherence'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

additionalTcTriple.forEach((question) => {
  additionalTcIndex += 1
  questions.push({
    id: `tc-${String(additionalTcIndex).padStart(3, '0')}`,
    number: sequence,
    type: 'text-completion',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select one answer choice for each blank. There is no partial credit.',
    responseGroups: question.blanks.map((blank, blankIndex) => ({
      id: `blank${blankIndex + 1}`,
      label: `Blank (${['i', 'ii', 'iii'][blankIndex]})`,
      selectionMode: 'single',
      requiredSelections: 1,
      choices: makeChoices(blank),
    })),
    correctAnswer: Object.fromEntries(question.answer.map((answer, blankIndex) => [
      `blank${blankIndex + 1}`,
      [choiceIds[answer]],
    ])),
    explanation: question.explanation,
    skills: ['context clues', 'multi-blank coherence'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

let additionalSeIndex = sentenceEquivalence.length
additionalSentenceEquivalence.forEach((question) => {
  additionalSeIndex += 1
  questions.push({
    id: `se-${String(additionalSeIndex).padStart(3, '0')}`,
    number: sequence,
    type: 'sentence-equivalence',
    difficulty: question.difficulty,
    text: question.text,
    directions: 'Select exactly two answer choices that complete the sentence and produce equivalent meanings.',
    responseGroups: [{
      id: 'main',
      label: 'Select two',
      selectionMode: 'multiple',
      requiredSelections: 2,
      choices: makeChoices(question.choices),
    }],
    correctAnswer: { main: question.answer.map((answer) => choiceIds[answer]) },
    explanation: question.explanation,
    skills: ['sentence logic', 'equivalent meaning'],
    source: 'Original GRE-style practice created for Choco GRE',
  })
  sequence += 1
})

const passages = [...rcPassages, ...additionalRcPassages].map(({ id, title, text }) => ({ id, title, text }))
const bank = {
  version: 2,
  title: 'Choco GRE Verbal Reasoning Practice Bank',
  disclosure: 'These 300 questions are original GRE-style practice created for Choco GRE. They are not official ETS questions or recalled live-test content.',
  formatReference: 'https://www.ets.org/gre/test-takers/general-test/prepare/content/verbal-reasoning.html',
  counts: {
    total: questions.length,
    readingComprehension: questions.filter((question) => question.type === 'reading-comprehension').length,
    textCompletion: questions.filter((question) => question.type === 'text-completion').length,
    sentenceEquivalence: questions.filter((question) => question.type === 'sentence-equivalence').length,
  },
  passages,
  questions,
}

const failures = []
if (bank.counts.total !== 300) failures.push(`expected 300 questions, found ${bank.counts.total}`)
if (bank.counts.readingComprehension !== 100) failures.push('expected 100 Reading Comprehension questions')
if (bank.counts.textCompletion !== 100) failures.push('expected 100 Text Completion questions')
if (bank.counts.sentenceEquivalence !== 100) failures.push('expected 100 Sentence Equivalence questions')
if (new Set(questions.map((question) => question.id)).size !== questions.length) failures.push('question IDs are not unique')
if (questions.some((question, index) => question.number !== index + 1)) failures.push('question numbers are not continuous')

const normalizedPrompts = new Set()
for (const question of questions) {
  const normalizedPrompt = [
    question.type,
    question.passageId ?? '',
    question.stem ?? question.text ?? '',
  ].join('|').toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  if (normalizedPrompts.has(normalizedPrompt)) failures.push(`${question.id} duplicates another prompt`)
  normalizedPrompts.add(normalizedPrompt)

  if (question.type === 'text-completion') {
    const blankMarkers = question.text.match(/\{\{blank\d+\}\}/g) ?? []
    if (blankMarkers.length !== question.responseGroups.length) {
      failures.push(`${question.id} blank markers do not match its response groups`)
    }
  }

  for (const group of question.responseGroups) {
    const normalizedChoices = group.choices.map((choice) => (
      choice.text.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    ))
    if (new Set(normalizedChoices).size !== normalizedChoices.length) {
      failures.push(`${question.id} has duplicate choices in ${group.id}`)
    }
    const validIds = new Set(group.choices.map((choice) => choice.id))
    const answers = question.correctAnswer[group.id] ?? []
    if (!answers.length || answers.some((answer) => !validIds.has(answer))) {
      failures.push(`${question.id} has an invalid correct answer for ${group.id}`)
    }
    if (group.requiredSelections && answers.length !== group.requiredSelections) {
      failures.push(`${question.id} answer count does not match ${group.id}`)
    }
  }
}

if (failures.length) throw new Error(failures.join('\n'))

const json = `${JSON.stringify(bank, null, 2)}\n`
const outputs = [
  resolve(projectRoot, 'gre_verbal_practice_300.json'),
  resolve(projectRoot, 'src/data/verbalPracticeQuestions.json'),
]
for (const output of outputs) {
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, json, 'utf8')
}

console.log(`Generated ${questions.length} original questions (${bank.counts.readingComprehension} RC, ${bank.counts.textCompletion} TC, ${bank.counts.sentenceEquivalence} SE).`)
