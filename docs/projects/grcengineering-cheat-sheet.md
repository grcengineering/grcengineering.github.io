# The GRC Engineering Cheat Sheet

## Legacy GRC vs. GRC Engineering in practice

<div class="cheat-sheet-table" markdown>

<table>
  <thead>
    <tr>
      <th style="width: 120px; text-align: center;">Program</th>
      <th>Legacy GRC</th>
      <th>GRC Engineering</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;"><em>All</em></td>
      <td>
        <ul>
          <li>Framework-first focus</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Threat-informed, systems thinking, design thinking</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">Governance</td>
      <td>
        <ul>
          <li>Policies, standards, procedures</li>
          <li>Docs =/= control reality</li>
          <li>Metric-less committees &amp; decisions</li>
          <li>Annual/semi-annual training (boring)</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>PaC enforces &ldquo;risk tolerance&rdquo; (pre-deploy/change)</li>
          <li>&ldquo;Autocorrect/reconcile&rdquo; docs &larr;&rarr; controls</li>
          <li>Metrics-focused committees &amp; decisions</li>
          <li>Real-time behavioral interventions &amp; scientific pedagogy</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">Risk</td>
      <td>
        <ul>
          <li>Qualitative risk analysis (manual)</li>
          <li>Subjective data &amp; heatmaps</li>
          <li>Fragmented weaknesses &amp; issues</li>
          <li>Accountability police</li>
          <li>Fear, Uncertainty, &amp; Doubt (FUD)</li>
          <li>TP<u>C</u>M, heavily third-party focused</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Quantitative risk analysis (automated)</li>
          <li>Objective data &amp; histograms</li>
          <li>Holistic risk scenarios (threat + vector + asset + impact)</li>
          <li>Decision support partners</li>
          <li>Evidence, Logic, Math, Reason (ELMR &gt;&gt;&gt; FUD)</li>
          <li>TP<u>R</u>M, balanced third + first-party focus</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">Compliance</td>
      <td>
        <ul>
          <li>Periodic, isolated control monitoring</li>
          <li>Evidence samples</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Automated, holistic control monitoring &amp; active testing</li>
          <li>Evidence populations (full)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">Trust &amp;<br>Assurance</td>
      <td>
        <ul>
          <li>Opaque, abstracted annual artifacts</li>
          <li>RFIs handled via email</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Transparent, real-time, historical visibility into controls</li>
          <li>Self-service RFIs &amp; questionnaire completion</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

</div>

<style>
.cheat-sheet-table table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9rem;
}

.cheat-sheet-table table thead th {
  background-color: #ffa84f !important;
  color: #000 !important;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 14px 16px;
  border: 1px solid #ccc;
}

.cheat-sheet-table table tbody td {
  padding: 12px 16px;
  border: 1px solid #ddd;
  vertical-align: top;
}

.cheat-sheet-table table tbody tr:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.02);
}

.cheat-sheet-table table tbody td:first-child {
  font-weight: 700;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.cheat-sheet-table table tbody ul {
  margin: 0;
  padding-left: 20px;
}

.cheat-sheet-table table tbody li {
  margin-bottom: 4px;
}

.cheat-sheet-table table tbody li:last-child {
  margin-bottom: 0;
}

[data-md-color-scheme="grcengineering-dark"] .cheat-sheet-table table tbody tr:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.04);
}

[data-md-color-scheme="grcengineering-dark"] .cheat-sheet-table table thead th {
  border-color: #555;
}

[data-md-color-scheme="grcengineering-dark"] .cheat-sheet-table table tbody td {
  border-color: #444;
}
</style>
