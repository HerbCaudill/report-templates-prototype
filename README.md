# Report Templates Feature Specification

This document describes the Report Templates feature, which allows users to create, manage, and generate reports from customizable templates.

## Overview

Report Templates enable users to define reusable document templates that combine static content with dynamic data from various sources. When generating a report, the system merges selected data with the template to produce a final document.

## Core Concepts

### Report Template

A report template consists of:

- **Name** - Display name for the template
- **Description** - Detailed description explaining the template's purpose and usage
- **Data sources** - One or more data sources to be merged into the template
- **Template file** - The uploaded document template (Word, Excel, or PowerPoint)

### Data Sources

Data sources define what data will be available when generating a report. Each data source is categorized and may require user selection at generation time.

#### Categories

| Category          | Description                  | Selection Behavior                                        |
| ----------------- | ---------------------------- | --------------------------------------------------------- |
| **Projects**      | Project-related data         | Single selection only (one project source per template)   |
| **Indicators**    | Performance indicators       | Single selection only (one indicator source per template) |
| **Data tables**   | Custom data tables           | Multiple allowed                                          |
| **Saved reports** | Previously saved report data | Multiple allowed                                          |

#### Project Data Sources

- **All projects** - Includes data for all projects; no user selection required
- **Single project** - User selects one project when generating
- **Single project, single reporting period** - User selects both a project and a reporting period when generating

#### Indicator Data Sources

- **All indicators** - Includes data for all indicators; no user selection required
- **Single indicator** - User selects one indicator when generating

### Template Data Source Keys

When a data source is added to a template, it is assigned a customizable **key**. This key is used as a prefix for placeholder tags in the template file.

For example, if a project data source has the key `project`, the template file would use tags like `{{project.name}}`, `{{project.budget}}`, etc.

### Template File

Template files are Word (.docx), Excel (.xlsx), or PowerPoint (.pptx) documents containing placeholder tags (e.g., `{{project.name}}`) that are replaced with actual data when generating reports.

## User Interface

### 1. Report Templates List

The main view displays all available templates in a list format.

**For each template row:**

- **Edit button** - Opens the edit page for the template
- **Word icon** - Visual indicator of document type
- **Template name** - Display name
- **Generate button** - Opens the generate dialog

**Actions:**

- **New template** button - Creates a new template

**URL:** `/` or `/#` (no hash)

### 2. Edit Template Page

A full-page form for creating or editing templates.

**Fields:**

- **Name** (required) - Text input for the template name
- **Description** - Multi-line text area for detailed description
- **Data sources** (required, min 1) - Table of selected data sources with:
  - Type column - The data source label
  - Key column - Editable text input for the placeholder key
  - Delete button - Removes the data source
  - "Add datasource..." dropdown - Grouped by category
- **Template** (required) - File upload for the document template

**Validation:**

- Name must not be empty
- At least one data source must be selected
- A template file must be uploaded
- The "Done" button is disabled until all required fields are valid

**Save Behavior:**

- **Editing existing template:** Auto-saves on every change
- **Creating new template:** Only saves when "Done" is clicked with valid data

**Actions:**

- **Done** button (with checkmark icon) - Returns to list (saves new templates if valid)
- **Delete this report template** link - Only shown for existing templates; deletes and returns to list

**URL patterns:**

- New template: `/#new`
- Edit existing: `/#edit/{template-id}`

**Browser navigation:** Back button returns to list without saving incomplete new templates

### 3. Generate Report Dialog

A modal dialog for generating a report from a template.

**Dynamic Fields (based on template data sources):**

- **Project dropdown** - Shown if template uses a single project data source
- **Reporting period dropdown** - Shown if template requires a reporting period
- **Indicator dropdown** - Shown if template uses a single indicator data source

**Static Fields:**

- **Output format toggle** - PDF or Word (default: PDF)
- **Save to documents checkbox** - Option to save to system document library
- **Certify checkbox** - Option to digitally certify the report

**Certification Flow:**

1. User checks "Certify" checkbox (disabled until required fields are filled)
2. Certification panel appears with statement: "I, [User Name], certify this report."
3. User clicks "Certify" button
4. Seal icon with "Certified" text replaces the button
5. Generate button becomes enabled

**Validation:**

- All required dropdowns must have a selection
- If "Certify" is checked, certification must be completed
- Generate button is disabled until valid

**Actions:**

- **Generate** button - Generates the report and closes dialog
- Click outside dialog - Closes without generating

## Information Tooltips

Contextual help is provided via info icons (ⓘ) that show tooltips on hover:

| Location                   | Tooltip Text                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Data sources "Key" column  | "This key must match the placeholder tags in your template file."                                                                               |
| Template upload            | "Upload a Word, Excel, or PowerPoint file with placeholder tags like {{project.name}} that will be replaced with data when generating reports." |
| Save to documents checkbox | "In addition to downloading the report, it will be saved in the system document library in the "[Template Name]" folder."                       |
| Certify checkbox           | "Certifying a report attaches your digital signature to the report, confirming the data is accurate and approved for distribution."             |
